import { createFileRoute } from "@tanstack/react-router";

import { MarketingLayout } from "@/components/layout/marketing-layout";
import { CapabilityGrid } from "@/features/landing/capability-grid";
import { CtaSection } from "@/features/landing/cta-section";
import { DiscoverySection } from "@/features/landing/discovery-section";
import { Hero } from "@/features/landing/hero";
import { Marquee } from "@/features/landing/marquee";
import { StepsSection } from "@/features/landing/steps-section";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "REA Studio — Ask the code, get the evidence" },
      {
        name: "description",
        content:
          "Question-driven reverse engineering in your browser: scan projects, map dependencies and get answers backed by verified source quotes.",
      },
      { property: "og:title", content: "REA Studio — Ask the code, get the evidence" },
      {
        property: "og:description",
        content: "Scan, trace and question any project in your browser with verified evidence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <MarketingLayout>
      <Hero />
      <Marquee />
      <CapabilityGrid />
      <DiscoverySection />
      <StepsSection />
      <CtaSection />
    </MarketingLayout>
  );
}
