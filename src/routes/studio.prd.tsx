import { createFileRoute } from "@tanstack/react-router";

import { studioHead } from "@/features/studio/screens";
import { PrdScreen } from "@/features/studio/screens/prd-screen";

export const Route = createFileRoute("/studio/prd")({
  head: () => studioHead("/studio/prd"),
  component: PrdScreen,
});
