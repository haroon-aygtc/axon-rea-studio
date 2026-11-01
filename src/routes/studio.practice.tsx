import { createFileRoute } from "@tanstack/react-router";

import { studioHead } from "@/features/studio/screens";
import { PracticeScreen } from "@/features/studio/screens/practice-screen";

export const Route = createFileRoute("/studio/practice")({
  head: () => studioHead("/studio/practice"),
  component: PracticeScreen,
});
