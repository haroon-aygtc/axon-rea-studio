import { createFileRoute } from "@tanstack/react-router";

import { studioHead } from "@/features/studio/screens";
import { OperationsScreen } from "@/features/studio/screens/operations-screen";

export const Route = createFileRoute("/studio/operations")({
  head: () => studioHead("/studio/operations"),
  component: OperationsScreen,
});
