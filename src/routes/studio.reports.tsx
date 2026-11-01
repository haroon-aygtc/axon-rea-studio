import { createFileRoute } from "@tanstack/react-router";

import { studioHead } from "@/features/studio/screens";
import { ReportsScreen } from "@/features/studio/screens/reports-screen";

export const Route = createFileRoute("/studio/reports")({
  head: () => studioHead("/studio/reports"),
  component: ReportsScreen,
});
