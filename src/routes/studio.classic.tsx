import { createFileRoute } from "@tanstack/react-router";

import { StudioFrame } from "@/features/studio/studio-frame";

export const Route = createFileRoute("/studio/classic")({
  head: () => ({
    meta: [
      { title: "Classic studio — REA Studio" },
      { name: "description", content: "The original REA studio, kept as a fallback." },
      { property: "og:title", content: "Classic REA studio" },
      { property: "og:description", content: "The original REA studio, kept as a fallback." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClassicStudio,
});

function ClassicStudio() {
  return (
    <div className="h-[calc(100dvh-3.5rem)]">
      <StudioFrame />
    </div>
  );
}
