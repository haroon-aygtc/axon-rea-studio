import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, FileCode2, Fingerprint, ListTree, ShieldCheck } from "lucide-react";

import { CountUp } from "@/components/motion/count-up";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TargetPicker } from "../components/target-launcher";
import { ScreenBody, ScreenHeader } from "../components/screen-header";
import { PIPELINE_AGENTS } from "../engine/agents";
import type { FindingKind, Target } from "../engine/types";
import { studioScreens } from "../screens";
import { useStudio } from "../store";

const KIND_LABEL: Record<FindingKind, string> = {
  url: "URLs",
  endpoint: "Endpoints",
  import: "Imports",
  dep: "Dependencies",
  storage: "Storage keys",
  route: "Routes",
  ui: "Screen text",
};

function formatBytes(n: number) {
  if (n > 1e6) return `${(n / 1e6).toFixed(1)} MB`;
  if (n > 1e3) return `${(n / 1e3).toFixed(1)} KB`;
  return `${n} B`;
}

function PipelineBoard() {
  const agents = useStudio((s) => s.agents);
  const status = useStudio((s) => s.status);
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {PIPELINE_AGENTS.map((a, i) => {
        const p = agents[a.id];
        const done = p.status === "done";
        return (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={cn("p-4 transition-colors", p.active && "border-primary/50")}>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{a.name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{a.room}</p>
                </div>
                <span className="font-display text-2xl font-semibold tabular-nums text-primary">
                  {p.count}
                </span>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full bg-gradient-ember"
                  animate={{ width: done ? "100%" : p.active ? "60%" : "0%" }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <p className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                {done ? <CheckCircle2 className="size-3 text-success" /> : null}
                {status === "idle" ? "waiting" : p.status}
              </p>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

function TargetSummary({ target }: { target: Target }) {
  const bytes = target.files.reduce((a, f) => a + f.size, 0);
  const passed = target.checks.filter((c) => c.ok).length;
  const kinds = (Object.keys(KIND_LABEL) as FindingKind[])
    .map((k) => ({ k, n: target.findings.filter((f) => f.kind === k).length }))
    .filter((x) => x.n > 0);
  const max = Math.max(1, ...kinds.map((x) => x.n));
  const biggest = [...target.files].sort((a, b) => b.size - a.size).slice(0, 6);

  const stats = [
    { icon: FileCode2, label: "Files", value: target.total, hint: formatBytes(bytes) },
    { icon: Fingerprint, label: "Findings", value: target.findings.length, hint: `${kinds.length} kinds` },
    { icon: ListTree, label: "Spec lines", value: target.spec.length, hint: "SPEC.md" },
    { icon: ShieldCheck, label: "Checks passed", value: passed, hint: `of ${target.checks.length}` },
  ];

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <s.icon className="size-4 text-primary" />
            </div>
            <p className="mt-3 font-display text-3xl font-semibold">
              <CountUp value={s.value} />
            </p>
            <p className="text-xs text-muted-foreground">{s.hint}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>What was found</CardTitle>
            <CardDescription>Findings by kind, each linked to a file and line</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {kinds.length === 0 && <p className="text-sm text-muted-foreground">No findings in this target.</p>}
            {kinds.map(({ k, n }, i) => (
              <div key={k} className="grid grid-cols-[110px_1fr_40px] items-center gap-3 text-sm">
                <span className="text-muted-foreground">{KIND_LABEL[k]}</span>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-gradient-ember"
                    initial={{ width: 0 }}
                    animate={{ width: `${(n / max) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <span className="text-right font-mono tabular-nums">{n}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Largest files</CardTitle>
            <CardDescription>Hashed locally with SHA-256</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {biggest.map((f) => (
                <li key={f.path} className="flex items-center gap-3 py-2.5 text-sm">
                  <FileCode2 className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate font-mono text-xs">{f.path}</span>
                  <Badge variant="muted">{formatBytes(f.size)}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Explore the target</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {studioScreens
            .filter((s) => s.to !== "/studio")
            .map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="group flex items-center gap-3 rounded-xl border bg-card/60 p-4 transition-colors hover:border-primary/50"
              >
                <s.icon className="size-4 text-primary" />
                <span className="flex-1 text-sm font-medium">{s.label}</span>
                <ArrowRight className="size-4 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            ))}
        </div>
      </div>
    </>
  );
}

export function ScannerScreen() {
  const target = useStudio((s) => s.target);
  const status = useStudio((s) => s.status);
  const showPipeline = status !== "idle";

  return (
    <ScreenBody>
      <ScreenHeader screen="/studio" />
      {!target && status !== "loading" && status !== "running" && (
        <Card className="overflow-hidden">
          <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-4">
              <Badge>Step 1</Badge>
              <h2 className="text-3xl font-semibold leading-tight">Choose what to investigate.</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Six agents receive the files, extract hosts, endpoints, libraries and storage keys,
                write a spec, document it, rebuild a scaffold and verify every claim. Every step is
                logged.
              </p>
            </div>
            <TargetPicker />
          </div>
        </Card>
      )}
      {showPipeline && <PipelineBoard />}
      {target && <TargetSummary target={target} />}
    </ScreenBody>
  );
}
