import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, LayoutDashboard } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { AccountMenu } from "@/features/auth/account-menu";
import { StudioFrame } from "@/features/studio/studio-frame";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Studio — REA Reverse Engineering Studio" },
      {
        name: "description",
        content:
          "Load a project, file or website and investigate it with scans, maps, reports and the REA agent.",
      },
      { property: "og:title", content: "REA Studio workspace" },
      {
        property: "og:description",
        content: "Scan, map and question any target in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudioPage,
});

function StudioPage() {
  return (
    <div className="flex h-[100dvh] flex-col">
      <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b bg-surface px-3 md:px-5">
        <div className="flex items-center gap-2">
          <Button asChild size="icon" variant="ghost" aria-label="Back to home">
            <Link to="/">
              <ArrowLeft />
            </Link>
          </Button>
          <Link to="/" aria-label="REA Studio home" className="hidden sm:block">
            <Logo />
          </Link>
          <span className="hidden font-mono text-[11px] uppercase tracking-wider text-muted-foreground md:inline">
            / workspace
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="ghost">
            <Link to="/dashboard">
              <LayoutDashboard /> <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>
          <AccountMenu compact />
        </div>
      </header>
      <main className="min-h-0 flex-1">
        <StudioFrame />
      </main>
    </div>
  );
}
