import { createFileRoute } from "@tanstack/react-router";

import { studioHead } from "@/features/studio/screens";
import { AgentScreen } from "@/features/studio/screens/agent-screen";

export const Route = createFileRoute("/studio/agent")({
  head: () => studioHead("/studio/agent"),
  component: AgentScreen,
});
