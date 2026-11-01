import { createFileRoute } from "@tanstack/react-router";

import { studioHead } from "@/features/studio/screens";
import { UserFlowScreen } from "@/features/studio/screens/user-flow-screen";

export const Route = createFileRoute("/studio/user-flow")({
  head: () => studioHead("/studio/user-flow"),
  component: UserFlowScreen,
});
