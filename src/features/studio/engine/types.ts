export interface StudioFile {
  path: string; size: number; hash: string; text: string;
  bytes?: Uint8Array;
  read(limit: number): Promise<ArrayBuffer>;
}
export type FindingKind = 'url'|'endpoint'|'import'|'dep'|'storage'|'route'|'ui';
export interface Finding {
  id: string; kind: FindingKind; value: string; file: string; line: number;
  tag: 'observed'; method?: string; el?: string; ver?: string;
}
export interface SpecLine {
  tag: 'observed'|'inferred'|'unknown'; text: string; refs: string[];
  kind: 'host'|'endpoint'|'route'|'ui'|'lib'|'storage'|'gap';
  value: string; method?: string; ver?: string;
}
export interface DocLine { doc: string; line: string }
export interface ScaffoldItem { path: string; content: string; bytes: number }
export interface VerifierCheck { ok: boolean; group: string; name: string }
export interface StudioEvent { seq: number; t: number; type: string; payload: Record<string, unknown> }
export interface Target {
  name: string; files: StudioFile[]; findings: Finding[]; spec: SpecLine[];
  docs: DocLine[]; scaffold: ScaffoldItem[]; checks: VerifierCheck[];
  total: number; vf: Record<string, StudioFile>; authorizedAt?: number;
}
export type PipelineAgentId = 'intake'|'analyst'|'spec'|'docs'|'rebuilder'|'verifier';
export type AgentItem =
  | { agent: 'intake'; item: StudioFile }
  | { agent: 'analyst'; item: Finding }
  | { agent: 'spec'; item: SpecLine }
  | { agent: 'docs'; item: DocLine }
  | { agent: 'rebuilder'; item: {kind: 'spec'; line: string} | ({kind: 'src'} & ScaffoldItem) }
  | { agent: 'verifier'; item: VerifierCheck };
export interface AgentProgress { count: number; status: string; items: AgentItem[]; active: boolean }
