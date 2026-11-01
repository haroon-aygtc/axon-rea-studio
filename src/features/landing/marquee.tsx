import { marqueeTerms } from "@/content/landing";

export function Marquee() {
  const items = [...marqueeTerms, ...marqueeTerms];
  return (
    <div className="relative overflow-hidden border-y py-5 [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
      <div className="flex w-max animate-marquee gap-10">
        {items.map((term, i) => (
          <span
            key={`${term}-${i}`}
            className="flex items-center gap-10 font-display text-2xl text-muted-foreground md:text-3xl"
            aria-hidden={i >= marqueeTerms.length}
          >
            {term}
            <span className="size-1.5 rounded-full bg-primary" />
          </span>
        ))}
      </div>
    </div>
  );
}
