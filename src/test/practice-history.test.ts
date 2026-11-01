import { describe, expect, it } from "vitest";

import { computePracticeStats, parsePracticeHistory } from "@/features/practice/practice-history";

const saved = JSON.stringify({
  tasks: [{ id: "t1", question: "Where is the score saved?" }],
  runs: [
    { id: "r1", time: 1, status: "Completed", duration: 1000, calls: 3, grade: { score: 100, checks: [{ pass: true }, { pass: true }] } },
    { id: "r2", time: 2, status: "Completed", duration: 1000, calls: 3, grade: { score: 50, checks: [{ pass: true }, { pass: false }] } },
  ],
});

describe("dashboard practice stats", () => {
  it("averages run scores and counts only fully passed runs as passes", () => {
    const stats = computePracticeStats(parsePracticeHistory(saved));
    expect(stats.runs).toBe(2);
    expect(stats.averageScore).toBe(75);
    expect(stats.bestScore).toBe(100);
    expect(stats.passRate).toBe(50);
  });

  it("shows newest runs first", () => {
    expect(parsePracticeHistory(saved).runs.map((r) => r.id)).toEqual(["r2", "r1"]);
  });

  it("treats missing or corrupt saved data as empty", () => {
    expect(computePracticeStats(parsePracticeHistory("{bad")).runs).toBe(0);
    expect(computePracticeStats(parsePracticeHistory(null)).averageScore).toBeNull();
  });
});
