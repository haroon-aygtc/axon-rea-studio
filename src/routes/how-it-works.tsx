import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronDown, EyeOff, KeyRound, Lock, Minus } from "lucide-react";

import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StepsSection } from "@/features/landing/steps-section";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — REA Studio" },
      {
        name: "description",
        content:
          "How REA scans targets locally, investigates with an AI agent and verifies every quoted piece of evidence.",
      },
      { property: "og:title", content: "How REA Studio works" },
      {
        property: "og:description",
        content: "Local scanning, question-driven AI investigation and verified evidence.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorksPage,
});

const privacy = [
  {
    icon: Lock,
    title: "Local by default",
    body: "Scanning, maps and reports run entirely in your browser. Nothing is uploaded.",
  },
  {
    icon: EyeOff,
    title: "Only what's asked",
    body: "With AI on, only your question, the scan summary and the excerpts the agent requests are shared — after you agree.",
  },
  {
    icon: KeyRound,
    title: "Answer keys stay private",
    body: "Practice answers never leave your device; the agent is graded locally.",
  },
];

const can = [
  "Search, read and trace source files",
  "Inspect binary headers, strings and hex",
  "Map hosts, endpoints, storage and routes",
  "Draft PRDs, flows and architecture notes",
];
const cannot = [
  "Run a native debugger or disassembler",
  "Bypass sites that block browser downloads",
  "Train or fine-tune the AI model",
];

const faqs = [
  {
    q: "Do I need an account?",
    a: "No for scanning, maps and reports. Yes for AI investigations and practice runs.",
  },
  {
    q: "Can I inspect a live website?",
    a: "Yes, if the site allows browser downloads. Otherwise save the files and load them directly.",
  },
  {
    q: "How is evidence verified?",
    a: "Every quote the agent cites is matched against the actual file contents before it's marked verified.",
  },
];

function HowItWorksPage() {
  return (
    <MarketingLayout>
      <div className="pt-16">
        <Section className="pb-0 md:pb-0">
          <Reveal className="max-w-3xl space-y-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">How it works</p>
            <h1 className="text-5xl font-semibold leading-[0.98] md:text-7xl">
              Evidence first. <span className="text-gradient-ember">Always.</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              REA treats every answer like a finding: it must point to the line of code that proves
              it.
            </p>
          </Reveal>
        </Section>

        <StepsSection />

        <Section className="pt-0 md:pt-0">
          <SectionHeading eyebrow="Privacy" title="Your files, your device." />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {privacy.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <Card className="h-full p-6">
                  <p.icon className="size-5 text-primary" />
                  <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section className="grid gap-4 pt-0 md:grid-cols-2 md:pt-0">
          <Reveal>
            <Card className="h-full p-6">
              <h3 className="text-lg font-semibold">What REA can do</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {can.map((c) => (
                  <li key={c} className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" /> {c}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <Card className="h-full p-6">
              <h3 className="text-lg font-semibold">Current limits</h3>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {cannot.map((c) => (
                  <li key={c} className="flex gap-3">
                    <Minus className="mt-0.5 size-4 shrink-0" /> {c}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </Section>

        <Section className="pt-0 md:pt-0">
          <SectionHeading eyebrow="FAQ" title="Common questions" />
          <div className="mt-8 divide-y rounded-2xl border">
            {faqs.map((f) => (
              <details key={f.q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {f.q}
                  <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-12">
            <Button asChild size="lg" variant="ember">
              <Link to="/studio">
                Try it now <ArrowRight />
              </Link>
            </Button>
          </div>
        </Section>
      </div>
    </MarketingLayout>
  );
}
