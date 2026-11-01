import { createFileRoute } from "@tanstack/react-router";

import { studioHead } from "@/features/studio/screens";
import { DiscoveryScreen } from "@/features/studio/screens/discovery-screen";

export const Route = createFileRoute("/studio/discovery")({
  head: () => studioHead("/studio/discovery"),
  component: DiscoveryScreen,
});
