import { createFileRoute } from "@tanstack/react-router";

import { studioHead } from "@/features/studio/screens";
import { AgentsScreen } from "@/features/studio/screens/agents-screen";

export const Route = createFileRoute("/studio/agents")({
  head: () => studioHead("/studio/agents"),
  component: AgentsScreen,
});
