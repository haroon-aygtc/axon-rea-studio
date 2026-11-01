import JSZip from "jszip";
import type { StudioFile } from "./types";
export const SKIP =
  /\.(png|jpe?g|gif|webp|ico|icns|woff2?|ttf|otf|mp[34]|wav|pdf)$|node_modules\//i;
export const BYTE_CAP = 1048576;
export async function sha(bytes: Uint8Array): Promise<string> {
  try {
    const digest = await crypto.subtle.digest("SHA-256", new Uint8Array(bytes).buffer);
    return [...new Uint8Array(digest)]
      .slice(0, 4)
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return "n/a";
  }
}
export function toText(input: ArrayBuffer | Uint8Array): string {
  const u = input instanceof Uint8Array ? input : new Uint8Array(input);
  const m = Math.min(u.length, 4096);
  let z = 0;
  for (let i = 0; i < m; i++) if (u[i] === 0) z++;
  if (m && z / m > 0.02) {
    const out: string[] = [];
    let s = "";
    for (let i = 0; i < u.length && out.length < 40000; i++) {
      const v = u[i]!;
      if (v >= 32 && v < 127) s += String.fromCharCode(v);
      else {
        if (s.length >= 6) out.push(s);
        s = "";
      }
    }
    return out.join("\n");
  }
  return new TextDecoder().decode(u);
}
export function makeFile(path: string, input: Uint8Array | string, size?: number): StudioFile {
  const original = typeof input === "string" ? new TextEncoder().encode(input) : input;
  const bytes = original.slice(0, BYTE_CAP);
  return {
    path,
    size: size ?? original.length,
    hash: "",
    text: toText(bytes),
    bytes,
    read: async (limit) => bytes.slice(0, Math.max(0, limit)).buffer,
  };
}
export async function ingest(files: File[] | FileList): Promise<StudioFile[]> {
  const result: StudioFile[] = [];
  for (const file of Array.from(files)) {
    if (result.length >= 3000) break;
    if (/\.(zip|apk|jar|aar|ipa|xpi|crx)$/i.test(file.name)) {
      try {
        const zip = await JSZip.loadAsync(await file.arrayBuffer());
        for (const entry of Object.values(zip.files)) {
          if (entry.dir || result.length >= 3000) continue;
          const bytes = await entry.async("uint8array");
          result.push(makeFile(file.name + "!/" + entry.name, bytes, bytes.length));
        }
        continue;
      } catch {
        /* Legacy behavior: unreadable archives become ordinary files. */
      }
    }
    result.push(
      makeFile(
        file.webkitRelativePath || file.name,
        new Uint8Array(await file.slice(0, BYTE_CAP).arrayBuffer()),
        file.size,
      ),
    );
  }
  return result;
}
