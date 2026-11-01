/** Browser-safe sample data for the landing-page discovery map (no three.js imports). */
export type DiscoveryKind = "host" | "endpoint" | "lib" | "storage" | "ui" | "route";

export interface DiscoveryCluster {
  kind: DiscoveryKind;
  label: string;
  items: string[];
}

export const discoveryClusters: DiscoveryCluster[] = [
  { kind: "host", label: "Hosts", items: ["api.target.dev", "cdn.assets.io", "auth.target.dev", "telemetry.net"] },
  { kind: "endpoint", label: "Endpoints", items: ["POST /v1/score", "GET /v1/session", "PUT /v1/save", "GET /health", "WS /live"] },
  { kind: "lib", label: "Libraries", items: ["react 19", "zod", "three", "lodash", "date-fns"] },
  { kind: "storage", label: "Storage", items: ["localStorage.best", "indexedDB.runs", "cookie.sid"] },
  { kind: "ui", label: "Screen text", items: ["Game over", "Press space", "High score", "Retry"] },
  { kind: "route", label: "Routes", items: ["/", "/play", "/scores", "/settings"] },
];

export const discoveryKindLabel: Record<DiscoveryKind, string> = {
  host: "Hosts",
  endpoint: "Endpoints",
  lib: "Libraries",
  storage: "Storage",
  ui: "Screen text",
  route: "Routes",
};
