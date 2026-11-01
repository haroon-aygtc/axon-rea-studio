import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <Section>
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-ember p-10 text-primary-foreground md:p-16">
          <div className="absolute inset-0 bg-grid opacity-30 mix-blend-overlay" aria-hidden />
          <div className="relative max-w-2xl space-y-6">
            <h2 className="text-4xl font-semibold leading-[1.02] md:text-6xl">
              Your next question deserves evidence.
            </h2>
            <p className="text-lg opacity-80">
              Scanning is free and local. Sign in only when you want the AI investigator.
            </p>
            <Button asChild size="lg" variant="secondary" className="bg-ink text-paper hover:bg-ink/90">
              <Link to="/studio">
                Start investigating <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
