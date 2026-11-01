import { motion } from "motion/react";

import type { PracticeRun } from "@/features/practice/practice-history";

/** Bar chart of the most recent run scores, oldest on the left. */
export function ScoreChart({ runs }: { runs: PracticeRun[] }) {
  const recent = runs.slice(0, 16).reverse();
  return (
    <div className="flex h-44 items-end gap-1.5" role="img" aria-label="Recent practice scores">
      {recent.map((run, i) => (
        <div key={run.id} className="group relative flex h-full flex-1 items-end">
          <motion.div
            className="w-full rounded-t-md bg-gradient-ember"
            initial={{ height: 0 }}
            animate={{ height: `${Math.max(4, run.score)}%` }}
            transition={{ duration: 0.7, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
          />
          <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-popover px-1.5 py-0.5 font-mono text-[10px] opacity-0 transition-opacity group-hover:opacity-100">
            {run.score}
          </span>
        </div>
      ))}
    </div>
  );
}
