import type { ReactNode } from "react";
import { Radar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Target } from "../engine/types";
import { useStudio } from "../store";
import { useStudioUi } from "../ui-store";

interface RequireTargetProps {
  children: (target: Target) => ReactNode;
  /** What the screen will show once a target is loaded. */
  hint?: string;
}

/** Renders children with the loaded target, or an empty state with a launcher button. */
export function RequireTarget({ children, hint }: RequireTargetProps) {
  const target = useStudio((s) => s.target);
  const status = useStudio((s) => s.status);
  const openLauncher = useStudioUi((s) => s.setLauncherOpen);

  if (target) return <>{children(target)}</>;

  const busy = status === "loading" || status === "running";
  return (
    <Card className="overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden />
      <div className="relative flex flex-col items-center gap-4 px-6 py-20 text-center">
        <div className="relative grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          {busy && <span className="absolute inset-0 animate-pulse-ring rounded-2xl border border-primary" />}
          <Radar className="size-6" />
        </div>
        <h2 className="text-xl font-semibold">{busy ? "Scanning target…" : "No target loaded"}</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          {busy
            ? "Results will appear here as the agents deliver them."
            : (hint ?? "Load files, a folder, the sample or a website to fill this screen.")}
        </p>
        {!busy && (
          <Button variant="ember" onClick={() => openLauncher(true)}>
            Choose a target
          </Button>
        )}
      </div>
    </Card>
  );
}
