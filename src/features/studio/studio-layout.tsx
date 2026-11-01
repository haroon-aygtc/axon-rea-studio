import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

import { Logo } from "@/components/brand/logo";
import { StudioNav } from "./components/studio-nav";
import { StudioTopbar } from "./components/studio-topbar";
import { TargetLauncherDialog } from "./components/target-launcher";

/** App frame for every studio screen: sidebar (desktop), sheet menu (mobile), top bar. */
export function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh]">
      <aside className="sticky top-0 hidden h-[100dvh] w-64 shrink-0 flex-col border-r bg-surface/60 lg:flex">
        <Link to="/" className="flex h-14 items-center border-b px-5" aria-label="REA Studio home">
          <Logo />
        </Link>
        <div className="min-h-0 flex-1">
          <StudioNav />
        </div>
      </aside>
      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[520px] rounded-full bg-rust/15 blur-[120px]" aria-hidden />
        <StudioTopbar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <TargetLauncherDialog />
    </div>
  );
}
