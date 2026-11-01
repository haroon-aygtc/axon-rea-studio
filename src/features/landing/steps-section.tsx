import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/layout/section";
import { steps } from "@/content/landing";

export function StepsSection() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Workflow"
        title="Three steps from mystery to proof."
        align="center"
      />
      <ol className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
        <div
          className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent md:block"
          aria-hidden
        />
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <Reveal key={step.title} delay={i * 0.12}>
              <li className="relative flex flex-col items-center text-center">
                <div className="relative grid size-14 place-items-center rounded-2xl border bg-background text-primary shadow-glow">
                  <Icon className="size-6" />
                  <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-gradient-ember font-mono text-[11px] font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </li>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
