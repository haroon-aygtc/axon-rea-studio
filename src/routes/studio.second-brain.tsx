import { createFileRoute } from "@tanstack/react-router";

import { studioHead } from "@/features/studio/screens";
import { SecondBrainScreen } from "@/features/studio/screens/second-brain-screen";

export const Route = createFileRoute("/studio/second-brain")({
  head: () => studioHead("/studio/second-brain"),
  component: SecondBrainScreen,
});
