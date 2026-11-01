import type { SpecLine } from "./types";
interface GeneratedFile {
  path: string;
  content: string;
}
interface CleanResult {
  files: GeneratedFile[];
  probes: [string, boolean][];
  mode: string;
}
export function build(spec: SpecLine[]): GeneratedFile[] {
  const E = spec.filter((s) => s.kind == "endpoint"),
    K = spec.filter((s) => s.kind == "storage"),
    D = spec.filter((s) => s.kind == "lib");
  return [
    {
      path: "src/api.ts",
      content:
        "// generated from SPEC.md only\n" +
        E.map(
          (s, i) =>
            "export const call" +
            i +
            "=(init?:RequestInit)=>fetch(" +
            JSON.stringify(s.value) +
            ",{method:" +
            JSON.stringify(s.method || "GET") +
            ",...init});",
        ).join("\n"),
    },
    {
      path: "src/storage.ts",
      content: "export const keys=" + JSON.stringify(K.map((s) => s.value)) + ";",
    },
    {
      path: "package.json",
      content: JSON.stringify(
        { dependencies: Object.fromEntries(D.map((s) => [s.value, s.ver || "*"])) },
        null,
        1,
      ),
    },
    {
      path: "README.md",
      content: "Scaffold from SPEC.md. Model adapter not connected, so no UI is generated.",
    },
  ];
}

export async function clean(spec: SpecLine[], signal?: AbortSignal): Promise<CleanResult> {
  const sp = spec.map(({ text, kind, value, method, ver, tag }) => ({
    text,
    kind,
    value,
    tag,
    ...(method === undefined ? {} : { method }),
    ...(ver === undefined ? {} : { ver }),
    refs: [],
  }));
  const fallback = (mode: string): CleanResult => ({ files: build(sp), probes: [], mode });
  signal?.throwIfAborted();
  if (typeof Worker === "undefined") return fallback("worker unavailable: isolation NOT enforced");
  return new Promise((resolve, reject) => {
    let worker: Worker | undefined;
    let url: string | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const dispose = () => {
      worker?.terminate();
      if (url) URL.revokeObjectURL(url);
      if (timer) clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
    };
    const abort = () => {
      dispose();
      reject(signal?.reason ?? new Error("Aborted"));
    };
    try {
      const code = `const build=${build.toString()};self.onmessage=async e=>{const probes=[];const t=async(n,f)=>{try{await f();probes.push([n,false])}catch{probes.push([n,true])}};
 await t('read target files',()=>{if(typeof self.TARGET==='undefined')throw 0});await t('touch the page DOM',()=>document.body.innerHTML);await t('read page storage',()=>localStorage.length);await t('network request',()=>fetch('https://example.com',{mode:'no-cors'}));self.postMessage({probes,files:build(e.data.spec)})}`;
      url = URL.createObjectURL(new Blob([code], { type: "text/javascript" }));
      worker = new Worker(url);
      timer = setTimeout(() => {
        dispose();
        resolve(fallback("worker timed out: ran on main thread, isolation NOT enforced"));
      }, 5000);
      worker.onmessage = (
        e: MessageEvent<{ files: GeneratedFile[]; probes: [string, boolean][] }>,
      ) => {
        dispose();
        resolve({ ...e.data, mode: "isolated worker" });
      };
      worker.onerror = () => {
        dispose();
        resolve(fallback("worker blocked: ran on main thread, isolation NOT enforced"));
      };
      signal?.addEventListener("abort", abort, { once: true });
      worker.postMessage({ spec: sp });
    } catch {
      dispose();
      resolve(fallback("worker unavailable: isolation NOT enforced"));
    }
  });
}
