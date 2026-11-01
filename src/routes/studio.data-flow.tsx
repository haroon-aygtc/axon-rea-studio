import { createFileRoute } from "@tanstack/react-router";

import { studioHead } from "@/features/studio/screens";
import { DataFlowScreen } from "@/features/studio/screens/data-flow-screen";

export const Route = createFileRoute("/studio/data-flow")({
  head: () => studioHead("/studio/data-flow"),
  component: DataFlowScreen,
});
