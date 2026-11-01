import { useRef, type MouseEvent } from "react";

import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/layout/section";
import { capabilities, type Capability } from "@/content/landing";
import { cn } from "@/lib/utils";

/** Card with a soft ember spotlight that follows the pointer. */
function CapabilityCard({ capability }: { capability: Capability }) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = capability.icon;

  function track(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={track}
      className="group relative h-full overflow-hidden rounded-2xl border bg-card p-6 shadow-card transition-colors duration-300 hover:border-primary/40"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(320px_circle_at_var(--x)_var(--y),color-mix(in_oklab,var(--ember)_14%,transparent),transparent_70%)]" />
      <div className="relative flex h-full flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="grid size-11 place-items-center rounded-xl border bg-surface-raised text-primary transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
            <Icon className="size-5" />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            /{capability.tag}
          </span>
        </div>
        <div className="mt-auto space-y-2">
          <h3 className="text-xl font-semibold">{capability.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{capability.description}</p>
        </div>
      </div>
    </div>
  );
}

export function CapabilityGrid() {
  return (
    <Section id="capabilities">
      <SectionHeading
        eyebrow="Capabilities"
        title={
          <>
            One studio for the whole <span className="text-gradient-ember">investigation</span>.
          </>
        }
        description="From the first scan to a shareable report, every tool reads the same loaded target."
      />
      <div className="mt-14 grid auto-rows-[minmax(220px,auto)] gap-4 md:grid-cols-2 lg:grid-cols-4">
        {capabilities.map((c, i) => (
          <Reveal
            key={c.title}
            delay={(i % 4) * 0.06}
            className={cn(c.wide && "lg:col-span-2")}
          >
            <CapabilityCard capability={c} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
