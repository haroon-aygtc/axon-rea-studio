import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";

import { useAuth } from "@/features/auth/auth-provider";
import { ConsentDialog } from "./consent-dialog";
import { useReaBridge } from "./use-rea-bridge";

/**
 * Hosts the original studio (public/studio.html) and wires it to React-owned
 * sign-in and sharing consent through the bridge.
 */
export function StudioFrame() {
  const { openSignIn } = useAuth();
  const [consentOpen, setConsentOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const resolver = useRef<((ok: boolean) => void) | null>(null);

  const requestConsent = useCallback(
    () =>
      new Promise<boolean>((resolve) => {
        resolver.current?.(false);
        resolver.current = resolve;
        setConsentOpen(true);
      }),
    [],
  );

  const decide = useCallback((ok: boolean) => {
    resolver.current?.(ok);
    resolver.current = null;
    setConsentOpen(false);
  }, []);

  useReaBridge({
    requestSignIn: () =>
      openSignIn("Sign in to run AI investigations. Your local scan stays open in the studio."),
    requestConsent,
  });

  return (
    <div className="relative h-full w-full overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 grid place-items-center" aria-hidden>
          <div className="relative size-16">
            <span className="absolute inset-0 animate-pulse-ring rounded-full border border-primary" />
            <span className="absolute inset-4 rounded-full bg-gradient-ember" />
          </div>
        </div>
      )}
      <motion.iframe
        src="/studio.html"
        title="REA Reverse Engineering Studio workspace"
        className="h-full w-full border-0 bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        onLoad={() => setLoaded(true)}
      />
      <ConsentDialog open={consentOpen} onDecide={decide} />
    </div>
  );
}
