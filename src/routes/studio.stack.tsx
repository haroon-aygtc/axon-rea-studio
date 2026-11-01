import { createFileRoute } from "@tanstack/react-router";

import { studioHead } from "@/features/studio/screens";
import { StackScreen } from "@/features/studio/screens/stack-screen";

export const Route = createFileRoute("/studio/stack")({
  head: () => studioHead("/studio/stack"),
  component: StackScreen,
});
