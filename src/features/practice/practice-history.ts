/**
 * Read-only view of the practice data the studio saves in this browser
 * (key `rea-practice-v1`, written by public/studio-suite.js). Pure functions only.
 */
export const PRACTICE_STORAGE_KEY = "rea-practice-v1";

export interface PracticeCheck {
  label?: string;
  pass: boolean;
}

export interface PracticeRun {
  id: string;
  taskId?: string;
  time: number;
  status: string;
  duration: number;
  calls: number;
  score: number;
  checks: PracticeCheck[];
}

export interface PracticeTask {
  id: string;
  question: string;
  target?: string;
}

export interface PracticeHistory {
  tasks: PracticeTask[];
  runs: PracticeRun[];
}

export interface PracticeStats {
  runs: number;
  challenges: number;
  averageScore: number | null;
  bestScore: number | null;
  passRate: number | null;
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
const num = (v: unknown, fallback = 0) => (typeof v === "number" && Number.isFinite(v) ? v : fallback);

export function parsePracticeHistory(raw: string | null): PracticeHistory {
  if (!raw) return { tasks: [], runs: [] };
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { tasks: [], runs: [] };
  }
  if (!isRecord(data)) return { tasks: [], runs: [] };

  const tasks: PracticeTask[] = Array.isArray(data["tasks"])
    ? data["tasks"].flatMap((t) =>
        isRecord(t) && typeof t["id"] === "string" && typeof t["question"] === "string"
          ? [
              {
                id: t["id"],
                question: t["question"],
                ...(typeof t["target"] === "string" ? { target: t["target"] } : {}),
              },
            ]
          : [],
      )
    : [];

  const runs: PracticeRun[] = Array.isArray(data["runs"])
    ? data["runs"].flatMap((r) => {
        if (!isRecord(r) || typeof r["id"] !== "string" || !isRecord(r["grade"])) return [];
        const grade = r["grade"];
        const checks = Array.isArray(grade["checks"])
          ? grade["checks"].filter(isRecord).map((c) => ({
              pass: c["pass"] === true,
              ...(typeof c["label"] === "string" ? { label: c["label"] } : {}),
            }))
          : [];
        return [
          {
            id: r["id"],
            ...(typeof r["taskId"] === "string" ? { taskId: r["taskId"] } : {}),
            time: num(r["time"]),
            status: typeof r["status"] === "string" ? r["status"] : "Unknown",
            duration: num(r["duration"]),
            calls: num(r["calls"]),
            score: Math.max(0, Math.min(100, num(grade["score"]))),
            checks,
          },
        ];
      })
    : [];

  return { tasks, runs: runs.sort((a, b) => b.time - a.time) };
}

/** A run "passes" when every grading check passed. */
export function computePracticeStats(history: PracticeHistory): PracticeStats {
  const { runs, tasks } = history;
  if (runs.length === 0)
    return { runs: 0, challenges: tasks.length, averageScore: null, bestScore: null, passRate: null };
  const scores = runs.map((r) => r.score);
  const passed = runs.filter((r) => r.checks.length > 0 && r.checks.every((c) => c.pass)).length;
  return {
    runs: runs.length,
    challenges: tasks.length,
    averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    bestScore: Math.max(...scores),
    passRate: Math.round((100 * passed) / runs.length),
  };
}
