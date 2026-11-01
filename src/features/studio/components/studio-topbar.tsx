import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Plus, RotateCcw } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AccountMenu } from "@/features/auth/account-menu";
import { cn } from "@/lib/utils";
import { useStudio } from "../store";
import { useStudioUi } from "../ui-store";
import { StudioNav } from "./studio-nav";

function useElapsed(startedAt: number | null, finishedAt: number | null) {
  const [now, setNow] = useState(() => startedAt ?? 0);
  useEffect(() => {
    if (!startedAt || finishedAt) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [startedAt, finishedAt]);
  if (!startedAt) return "00:00";
  const s = Math.max(0, Math.floor(((finishedAt ?? now) - startedAt) / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function Meter({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="flex items-baseline gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
      {label}
      <b className="text-sm font-medium normal-case tracking-normal text-foreground tabular-nums">{value}</b>
    </span>
  );
}

export function StudioTopbar() {
  const [navOpen, setNavOpen] = useState(false);
  const target = useStudio((s) => s.target);
  const status = useStudio((s) => s.status);
  const eventCount = useStudio((s) => s.eventCount);
  const startedAt = useStudio((s) => s.startedAt);
  const finishedAt = useStudio((s) => s.finishedAt);
  const reset = useStudio((s) => s.reset);
  const openLauncher = useStudioUi((s) => s.setLauncherOpen);
  const elapsed = useElapsed(startedAt, finishedAt);
  const running = status === "loading" || status === "running";

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b bg-background/80 px-3 backdrop-blur-xl md:px-5">
      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost" className="lg:hidden" aria-label="Open studio menu">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetTitle className="sr-only">Studio menu</SheetTitle>
          <div className="flex h-14 items-center border-b px-5">
            <Logo />
          </div>
          <div className="h-[calc(100%-3.5rem)]">
            <StudioNav onNavigate={() => setNavOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <Link to="/" className="lg:hidden" aria-label="REA Studio home">
        <Logo withWordmark={false} />
      </Link>

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span
          className={cn(
            "size-2 shrink-0 rounded-full",
            running ? "animate-pulse bg-primary" : target ? "bg-success" : "bg-muted-foreground/40",
          )}
          aria-hidden
        />
        <span className="truncate font-mono text-xs text-muted-foreground">
          {target ? target.name : running ? "loading target…" : "no target"}
        </span>
        <div className="ml-auto hidden items-center gap-5 xl:flex">
          <Meter label="time" value={elapsed} />
          <Meter label="files" value={target?.total ?? 0} />
          <Meter label="findings" value={target?.findings.length ?? 0} />
          <Meter label="events" value={eventCount} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {target && !running && (
          <Button size="icon" variant="ghost" aria-label="Clear target" onClick={reset}>
            <RotateCcw />
          </Button>
        )}
        <Button size="sm" variant="ember" onClick={() => openLauncher(true)} disabled={running}>
          <Plus /> <span className="hidden sm:inline">New target</span>
        </Button>
        <AccountMenu compact />
      </div>
    </header>
  );
}
