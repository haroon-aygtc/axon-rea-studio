import type { ReactNode } from "react";
import { motion } from "motion/react";

import { findScreen, type StudioPath } from "../screens";

interface ScreenHeaderProps {
  screen: StudioPath;
  /** Optional override for the description line. */
  description?: ReactNode;
  actions?: ReactNode;
}

export function ScreenHeader({ screen, description, actions }: ScreenHeaderProps) {
  const s = findScreen(screen);
  const Icon = s.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
    >
      <div className="flex items-start gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl border bg-surface-raised text-primary shadow-glow">
          <Icon className="size-5" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold md:text-3xl">{s.label}</h1>
          <p className="text-sm text-muted-foreground">{description ?? s.description}</p>
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </motion.div>
  );
}

/** Standard padded body for a studio screen. */
export function ScreenBody({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-8 md:py-8">{children}</div>
  );
}
