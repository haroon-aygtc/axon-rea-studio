import { createFileRoute, Outlet } from "@tanstack/react-router";

import { StudioLayout } from "@/features/studio/studio-layout";

/** Studio app frame. Client-only: scans read local files and draw on canvases. */
export const Route = createFileRoute("/studio")({
  ssr: false,
  component: StudioRoute,
});

function StudioRoute() {
  return (
    <StudioLayout>
      <Outlet />
    </StudioLayout>
  );
}
