import { createFileRoute } from "@tanstack/react-router";

import { studioHead } from "@/features/studio/screens";
import { ScannerScreen } from "@/features/studio/screens/scanner-screen";

export const Route = createFileRoute("/studio/")({
  head: () => studioHead("/studio"),
  component: ScannerScreen,
});
