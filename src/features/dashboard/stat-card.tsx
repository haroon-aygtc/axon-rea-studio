import type { LucideIcon } from "lucide-react";

import { CountUp } from "@/components/motion/count-up";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | null;
  suffix?: string;
  hint: string;
}

export function StatCard({ icon: Icon, label, value, suffix = "", hint }: StatCardProps) {
  return (
    <Card className="overflow-hidden p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Icon className="size-4 text-primary" />
      </div>
      <p className="mt-4 font-display text-4xl font-semibold">
        {value === null ? <span className="text-muted-foreground">—</span> : <CountUp value={value} suffix={suffix} />}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </Card>
  );
}
