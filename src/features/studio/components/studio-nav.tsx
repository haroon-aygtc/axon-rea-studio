import { Link } from "@tanstack/react-router";
import { History } from "lucide-react";

import { studioGroups } from "../screens";

/** Grouped list of studio screens; used by the desktop sidebar and mobile sheet. */
export function StudioNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav
      aria-label="Studio screens"
      className="flex h-full flex-col gap-6 overflow-y-auto px-3 py-5"
    >
      {studioGroups.map((group) => (
        <div key={group.label} className="space-y-1">
          <p className="px-3 pb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
            {group.label}
          </p>
          {group.screens.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              activeOptions={{ exact: true }}
              onClick={onNavigate}
              className="group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/30 hover:text-foreground data-[status=active]:bg-accent/50 data-[status=active]:text-foreground"
            >
              <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-opacity group-data-[status=active]:opacity-100" />
              <s.icon className="size-4 shrink-0 transition-colors group-data-[status=active]:text-primary" />
              {s.label}
            </Link>
          ))}
        </div>
      ))}
      <div className="mt-auto border-t pt-4">
        <Link
          to="/studio/classic"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <History className="size-4" /> Classic studio
        </Link>
      </div>
    </nav>
  );
}
