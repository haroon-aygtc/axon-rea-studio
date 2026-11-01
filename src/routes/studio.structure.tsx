import { createFileRoute } from "@tanstack/react-router";

import { studioHead } from "@/features/studio/screens";
import { StructureScreen } from "@/features/studio/screens/structure-screen";

export const Route = createFileRoute("/studio/structure")({
  head: () => studioHead("/studio/structure"),
  component: StructureScreen,
});
