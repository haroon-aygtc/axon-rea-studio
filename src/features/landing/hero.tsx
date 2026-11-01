import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeroCoreScene, LazyScene } from "@/components/three/lazy-scene";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease },
        };

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden pt-16">
      <div className="absolute inset-0 -z-20 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="absolute -right-40 top-10 -z-20 size-[640px] rounded-full bg-rust/25 blur-[140px]" />

      <LazyScene
        scene={HeroCoreScene}
        props={{}}
        className="absolute inset-0 -z-10 opacity-60 md:left-[38%] md:opacity-100"
      />

      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col justify-center px-5 py-16 md:px-8">
        <div className="max-w-2xl space-y-7">
          <motion.div {...enter(0)}>
            <Badge>
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary" />
                <span className="relative size-1.5 rounded-full bg-primary" />
              </span>
              Reverse engineering agent
            </Badge>
          </motion.div>

          <motion.h1
            {...enter(0.08)}
            className="text-5xl font-semibold leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Ask the code.
            <br />
            <span className="text-gradient-ember">Get the evidence.</span>
          </motion.h1>

          <motion.p
            {...enter(0.16)}
            className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            Load any project, file or website and ask what it does. REA scans, traces and answers
            with quotes verified against the source.
          </motion.p>

          <motion.div {...enter(0.24)} className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" variant="ember">
              <Link to="/studio">
                Open the studio <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/how-it-works">See how it works</Link>
            </Button>
          </motion.div>

          <motion.p
            {...enter(0.32)}
            className="flex items-center gap-2 font-mono text-xs text-muted-foreground"
          >
            <Lock className="size-3.5 text-primary" /> Files stay in your browser. No upload.
          </motion.p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}
