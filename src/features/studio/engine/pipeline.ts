import { PIPELINE_AGENTS } from "./agents";
import { extract } from "./extract";
import { sha, SKIP } from "./ingest";
import { clean } from "./worker";
import type { AgentItem, PipelineAgentId, SpecLine, StudioFile, Target } from "./types";
export interface PipelineHooks {
  emit(type: string, payload: Record<string, unknown>): void;
  onAgent(id: PipelineAgentId, items: AgentItem[], status: string): void;
}
export async function runPipeline(
  files: StudioFile[],
  name: string,
  hooks: PipelineHooks,
  signal?: AbortSignal,
): Promise<Target> {
  const S: Target = {
    name,
    files: [],
    findings: [],
    spec: [],
    docs: [],
    scaffold: [],
    checks: [],
    total: files.length,
    vf: Object.create(null) as Record<string, StudioFile>,
  };
  const check = () => signal?.throwIfAborted();
  const stage = (id: PipelineAgentId, label: string) => {
    check();
    hooks.emit("stage.started", { agent: id, label });
    hooks.onAgent(id, [], label);
  };
  const deliver = (id: PipelineAgentId, items: AgentItem[]) => {
    check();
    hooks.onAgent(id, items, "working");
    hooks.emit("agent.deliver", {
      agent: PIPELINE_AGENTS.find((a) => a.id === id)!.name,
      items: items.length,
    });
  };
  const end = (id: PipelineAgentId) => {
    hooks.onAgent(id, [], "done");
    hooks.emit("stage.finished", { agent: id });
  };
  hooks.emit("run.started", { target: name, files: files.length, authorized: true });
  stage("intake", "Hashing files");
  for (const f of files) {
    check();
    const r = { ...f, hash: await sha(new Uint8Array(await f.read(262144))) };
    S.files.push(r);
    S.vf[r.path] = r;
    deliver("intake", [{ agent: "intake", item: r }]);
  }
  end("intake");
  stage("analyst", "Scanning");
  const seen = new Set<string>();
  const cap: Record<string, number> = {};
  let n = 0;
  for (const f of S.files) {
    check();
    if (!SKIP.test(f.path))
      for (const raw of extract(f.text, f.path)) {
        const key = raw.kind + raw.value;
        if (seen.has(key)) continue;
        cap[raw.kind] = (cap[raw.kind] ?? 0) + 1;
        if (cap[raw.kind]! > 60) continue;
        seen.add(key);
        const finding = { ...raw, id: "F" + (S.findings.length + 1) };
        S.findings.push(finding);
        hooks.emit("finding", {
          id: finding.id,
          kind: finding.kind,
          value: finding.value.slice(0, 40),
          file: f.path,
        });
        deliver("analyst", [{ agent: "analyst", item: finding }]);
      }
    if (++n % 8 === 0) await new Promise<void>((r) => setTimeout(r, 0));
  }
  end("analyst");
  stage("spec", "Writing SPEC.md");
  const L = S.spec;
  const by = (kind: string) => S.findings.filter((f) => f.kind === kind);
  const ln = (
    text: string,
    refs: string[],
    tag: SpecLine["tag"],
    kind: SpecLine["kind"],
    value: string,
    method?: string,
    ver?: string,
  ) =>
    L.push({
      text,
      refs,
      tag,
      kind,
      value,
      ...(method === undefined ? {} : { method }),
      ...(ver === undefined ? {} : { ver }),
    });
  const hosts = new Set<string>();
  for (const f of by("url")) {
    let h = f.value;
    try {
      h = new URL(h).host;
    } catch {}
    if (!hosts.has(h)) {
      hosts.add(h);
      ln("Contacts " + h, [f.id], "observed", "host", h);
    }
  }
  by("endpoint").forEach((f) =>
    ln(
      "Calls " + (f.method || "GET") + " " + f.value,
      [f.id],
      f.method ? "observed" : "inferred",
      "endpoint",
      f.value,
      f.method || "GET",
    ),
  );
  by("route").forEach((f) => ln("Has route " + f.value, [f.id], "observed", "route", f.value));
  by("ui").forEach((f) => ln('Shows text "' + f.value + '"', [f.id], "observed", "ui", f.value));
  [...by("dep"), ...by("import")].forEach((f) =>
    ln(
      "Uses library " + f.value + (f.ver ? " " + f.ver : ""),
      [f.id],
      "observed",
      "lib",
      f.value,
      "",
      f.ver,
    ),
  );
  by("storage").forEach((f) =>
    ln('Persists local key "' + f.value + '"', [f.id], "observed", "storage", f.value),
  );
  for (const [k, w] of [
    ["endpoint", "network endpoints"],
    ["lib", "libraries"],
    ["ui", "screen text"],
  ] as const)
    if (!L.some((l) => l.kind === k))
      ln("No " + w + " found in " + S.files.length + " files scanned", [], "unknown", "gap", "");
  L.splice(90);
  deliver(
    "spec",
    L.map((item) => ({ agent: "spec", item })),
  );
  const leaks = S.files.filter((f) =>
    L.some((l) => l.text.includes(f.path) || l.text.includes(f.hash)),
  ).length;
  hooks.emit("spec.leakcheck", { matches: leaks });
  end("spec");
  stage("docs", "Drafting documents");
  const dl = (doc: string, line: string) => S.docs.push({ doc, line });
  dl("PRD", "# Product requirements");
  dl("PRD", "Target: " + name);
  for (const tag of ["observed", "inferred", "unknown"] as const) {
    dl("PRD", "## " + tag);
    L.filter((l) => l.tag === tag)
      .slice(0, 14)
      .forEach((l) => dl("PRD", "- " + l.text));
  }
  dl("STACK", "# Stack");
  L.filter((l) => l.kind === "lib")
    .slice(0, 25)
    .forEach((l) => dl("STACK", "- " + l.value + " " + (l.ver || "")));
  dl("FLOW", "graph LR");
  L.filter((l) => l.kind === "endpoint")
    .slice(0, 12)
    .forEach((l, i) =>
      dl(
        "FLOW",
        "  App -->|" + (l.method || "GET") + "| E" + i + '["' + l.value.replace(/"/g, "") + '"]',
      ),
    );
  deliver(
    "docs",
    S.docs.map((item) => ({ agent: "docs", item })),
  );
  end("docs");
  stage("rebuilder", "Wall self-test");
  const out = await clean(L, signal);
  check();
  hooks.emit("wall.selftest", { mode: out.mode, probes: out.probes });
  deliver(
    "rebuilder",
    L.map((l) => ({ agent: "rebuilder", item: { kind: "spec", line: l.text } })),
  );
  S.scaffold = out.files.map((f) => ({ ...f, bytes: f.content.length }));
  deliver(
    "rebuilder",
    S.scaffold.map((f) => ({ agent: "rebuilder", item: { kind: "src", ...f } })),
  );
  end("rebuilder");
  stage("verifier", "Re-checking every claim");
  const chk = (group: string, name: string, ok: boolean) => {
    const item = { group, name, ok };
    S.checks.push(item);
    deliver("verifier", [{ agent: "verifier", item }]);
  };
  for (const l of L.filter((l) => l.refs.length).slice(0, 60)) {
    const f = S.findings.find((f) => f.id === l.refs[0]);
    chk(
      "evidence",
      l.text.slice(0, 70),
      !!f && !!S.vf[f.file]?.text.includes(f.value.slice(0, 60)),
    );
  }
  const all = S.scaffold.map((f) => f.content).join("\n");
  for (const l of L.filter((l) => ["endpoint", "storage", "lib"].includes(l.kind)).slice(0, 60))
    chk("rebuild", l.kind + " " + l.value.slice(0, 50) + " present in src/", all.includes(l.value));
  chk("leak", "spec has no file paths or hashes (" + leaks + " matches)", leaks === 0);
  end("verifier");
  hooks.emit("run.finished", {
    checks: S.checks.length,
    passed: S.checks.filter((c) => c.ok).length,
    findings: S.findings.length,
  });
  return S;
}
