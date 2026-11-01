import { useEffect, useRef } from "react";

import { supabase } from "@/integrations/supabase/client";
import { agentRequestSchema, agentResponseSchema, validateToolInput } from "@/lib/rea-contract";
import { inspectWebsite } from "@/lib/rea-website";

declare global {
  interface Window {
    reaBridge?: {
      request: (body: unknown, signal?: AbortSignal) => Promise<unknown>;
      validateTool: typeof validateToolInput;
      inspectWebsite: typeof inspectWebsite;
    };
  }
}

interface BridgeHandlers {
  /** Called when an AI request needs a signed-in user. */
  requestSignIn: () => void;
  /** Resolves true when the user agrees to share excerpts for this target. */
  requestConsent: () => Promise<boolean>;
}

/**
 * Exposes `window.reaBridge` for the embedded studio (same origin, read via
 * window.parent). Validates every request/response with the shared contract
 * and attaches the user's bearer token; the server verifies it independently.
 */
export function useReaBridge(handlers: BridgeHandlers) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    let consentedTarget: string | undefined;
    let consentedUser: string | undefined;

    window.reaBridge = {
      validateTool: validateToolInput,
      inspectWebsite,
      request: async (body, signal) => {
        const input = agentRequestSchema.parse(body);
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          handlersRef.current.requestSignIn();
          throw new Error(
            "Sign in, then submit your question again. Local scanning does not need an account.",
          );
        }
        if (consentedTarget !== input.summary || consentedUser !== data.session.user.id) {
          const ok = await handlersRef.current.requestConsent();
          if (!ok)
            throw new Error("AI sharing declined. Your files remain available for local analysis.");
          consentedTarget = input.summary;
          consentedUser = data.session.user.id;
        }
        const response = await fetch("/api/rea-agent", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${data.session.access_token}`,
          },
          body: JSON.stringify(input),
          ...(signal ? { signal } : {}),
        });
        const result: unknown = await response.json();
        if (!response.ok) {
          const message =
            typeof result === "object" &&
            result &&
            "error" in result &&
            typeof result.error === "string"
              ? result.error
              : "REA request failed.";
          throw new Error(message);
        }
        return agentResponseSchema.parse(result);
      },
    };
    return () => {
      delete window.reaBridge;
    };
  }, []);
}
