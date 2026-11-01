import { CheckCircle2, CircleDashed, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { PracticeRun, PracticeTask } from "@/features/practice/practice-history";

const dateFormat = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function StatusIcon({ status }: { status: string }) {
  if (status === "Completed" || status === "Done")
    return <CheckCircle2 className="size-4 text-success" />;
  if (status === "Failed") return <XCircle className="size-4 text-destructive" />;
  return <CircleDashed className="size-4 text-muted-foreground" />;
}

interface RunListProps {
  runs: PracticeRun[];
  tasks: PracticeTask[];
}

export function RunList({ runs, tasks }: RunListProps) {
  const question = (id?: string) => tasks.find((t) => t.id === id)?.question ?? "Practice challenge";
  return (
    <ul className="divide-y">
      {runs.slice(0, 8).map((run) => (
        <li key={run.id} className="flex items-center gap-4 py-3.5">
          <StatusIcon status={run.status} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{question(run.taskId)}</p>
            <p className="font-mono text-[11px] text-muted-foreground">
              {run.time ? dateFormat.format(run.time) : "—"} · {run.calls} tool calls ·{" "}
              {Math.round(run.duration / 1000)}s
            </p>
          </div>
          <Badge variant={run.score >= 80 ? "success" : run.score >= 50 ? "default" : "danger"}>
            {run.score}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
