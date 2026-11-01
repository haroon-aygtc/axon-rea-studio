import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";
import { ClientOnly } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

/**
 * 3D scenes import three.js, which must never load during SSR. Each scene is a
 * lazy module rendered only on the client, with a soft glow placeholder.
 */
export const HeroCoreScene = lazy(() => import("./hero-core"));
export const DiscoveryGraphScene = lazy(() => import("./discovery-graph"));

interface LazySceneProps<P extends object> {
  scene: LazyExoticComponent<ComponentType<P>>;
  props: P;
  className?: string;
}

function ScenePlaceholder({ className }: { className?: string | undefined }) {
  return (
    <div className={cn("grid place-items-center", className)} aria-hidden>
      <div className="size-40 animate-pulse rounded-full bg-primary/10 blur-3xl" />
    </div>
  );
}

export function LazyScene<P extends object>({ scene: Scene, props, className }: LazySceneProps<P>) {
  return (
    <ClientOnly fallback={<ScenePlaceholder className={className} />}>
      <Suspense fallback={<ScenePlaceholder className={className} />}>
        <div className={className}>
          <Scene {...props} />
        </div>
      </Suspense>
    </ClientOnly>
  );
}
