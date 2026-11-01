import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/layout/section";
import { DiscoveryGraphScene, LazyScene } from "@/components/three/lazy-scene";
import { discoveryClusters } from "@/content/discovery-sample";

export function DiscoverySection() {
  return (
    <Section className="grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Memory map"
          title="See everything a target touches."
          description="REA links hosts, endpoints, libraries, storage, routes and screen text into one living map. Drag to orbit, hover a node to read it."
        />
        <Reveal delay={0.1}>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {discoveryClusters.map((c) => (
              <div key={c.kind} className="rounded-xl border bg-card/60 px-4 py-3">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {c.label}
                </dt>
                <dd className="font-display text-2xl font-semibold">{c.items.length}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
      <Reveal delay={0.15}>
        <div className="relative aspect-square overflow-hidden rounded-3xl border bg-card/40 shadow-card md:aspect-[4/3]">
          <div className="absolute inset-0 bg-noise opacity-40" aria-hidden />
          <LazyScene
            scene={DiscoveryGraphScene}
            props={{ clusters: discoveryClusters }}
            className="absolute inset-0"
          />
          <p className="pointer-events-none absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            sample target · drag to orbit
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
