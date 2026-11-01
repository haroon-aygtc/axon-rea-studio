import { createFileRoute } from "@tanstack/react-router";

import { studioHead } from "@/features/studio/screens";
import { ArchitectureScreen } from "@/features/studio/screens/architecture-screen";

export const Route = createFileRoute("/studio/architecture")({
  head: () => studioHead("/studio/architecture"),
  component: ArchitectureScreen,
});
