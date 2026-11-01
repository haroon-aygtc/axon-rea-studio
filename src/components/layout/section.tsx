import type { HTMLAttributes, ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function Section({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28", className)} {...props} />
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
}

export function SectionHeading({ eyebrow, title, description, align = "left" }: SectionHeadingProps) {
  return (
    <Reveal className={cn("max-w-2xl space-y-4", align === "center" && "mx-auto text-center")}>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 className="text-3xl font-semibold leading-[1.05] md:text-5xl">{title}</h2>
      {description && (
        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
      )}
    </Reveal>
  );
}
