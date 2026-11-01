import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Gauge, ListChecks, Target } from "lucide-react";

import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RunList } from "@/features/dashboard/run-list";
import { ScoreChart } from "@/features/dashboard/score-chart";
import { StatCard } from "@/features/dashboard/stat-card";
import { useAuth } from "@/features/auth/auth-provider";
import { computePracticeStats } from "@/features/practice/practice-history";
import { usePracticeHistory } from "@/features/practice/use-practice-history";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — REA Studio" },
      {
        name: "description",
        content: "Your REA practice scores, challenges and recent agent runs saved in this browser.",
      },
      { property: "og:title", content: "REA Studio dashboard" },
      { property: "og:description", content: "Track how the REA agent performs on your own code." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { history, loaded } = usePracticeHistory();
  const { user, openSignIn } = useAuth();
  const stats = computePracticeStats(history);
  const hasRuns = history.runs.length > 0;

  return (
    <MarketingLayout>
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-28 md:px-8">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Dashboard</p>
            <h1 className="text-4xl font-semibold md:text-6xl">
              {user ? "Welcome back." : "Your investigations."}
            </h1>
            <p className="max-w-xl text-muted-foreground">
              Practice results are saved only in this browser. Open the studio to write new
              challenges and run the agent against your code.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!user && (
              <Button variant="outline" onClick={() => openSignIn()}>
                Sign in for AI runs
              </Button>
            )}
            <Button asChild variant="ember">
              <Link to="/studio">
                Open studio <ArrowRight />
              </Link>
            </Button>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={ListChecks} label="Runs" value={loaded ? stats.runs : null} hint="Practice sessions graded" />
          <StatCard icon={Target} label="Challenges" value={loaded ? stats.challenges : null} hint="Written on your code" />
          <StatCard icon={Gauge} label="Avg score" value={stats.averageScore} suffix="%" hint="Across all runs" />
          <StatCard icon={Award} label="Pass rate" value={stats.passRate} suffix="%" hint="Every check passed" />
        </div>

        {loaded && !hasRuns ? (
          <Reveal>
            <Card className="mt-6 overflow-hidden">
              <div className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden />
              <CardContent className="relative flex flex-col items-center gap-4 py-16 text-center">
                <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Target className="size-6" />
                </div>
                <h2 className="text-2xl font-semibold">No practice runs yet</h2>
                <p className="max-w-md text-sm text-muted-foreground">
                  Load your code in the studio, open the Practice tab and write a challenge with a
                  private answer key. Scores will appear here.
                </p>
                <Button asChild variant="ember">
                  <Link to="/studio">Create a challenge</Link>
                </Button>
              </CardContent>
            </Card>
          </Reveal>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Score trend</CardTitle>
                <CardDescription>Last {Math.min(16, history.runs.length)} runs</CardDescription>
              </CardHeader>
              <CardContent>
                <ScoreChart runs={history.runs} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent runs</CardTitle>
                <CardDescription>
                  Best score {stats.bestScore ?? "—"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RunList runs={history.runs} tasks={history.tasks} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MarketingLayout>
  );
}
