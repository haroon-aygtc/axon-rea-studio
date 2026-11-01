import { useState } from "react";
import { Loader2 } from "lucide-react";
import "@lovable.dev/cloud-auth-js/styles.css";

import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Logo } from "@/components/brand/logo";

type Provider = "google" | "lovable";

interface SignInDialogProps {
  open: boolean;
  reason?: string | undefined;
  onOpenChange: (open: boolean) => void;
}

export function SignInDialog({ open, reason, onOpenChange }: SignInDialogProps) {
  const [pending, setPending] = useState<Provider | null>(null);
  const [error, setError] = useState("");

  async function signIn(provider: Provider) {
    setError("");
    setPending(provider);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    setPending(null);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    if (!result.redirected) onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <Logo className="mb-3" />
          <DialogTitle>Sign in to REA</DialogTitle>
          <DialogDescription>
            {reason ??
              "AI investigations and practice runs need an account. Local scanning works without one."}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 flex flex-col gap-3">
          <Button variant="outline" disabled={!!pending} onClick={() => signIn("google")}>
            {pending === "google" && <Loader2 className="animate-spin" />}
            Continue with Google
          </Button>
          <Button
            className="lovable-auth-button"
            disabled={!!pending}
            onClick={() => signIn("lovable")}
          >
            {pending === "lovable" && <Loader2 className="animate-spin" />}
            Continue with Lovable
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Keep scanning locally
          </Button>
        </div>
        {error && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {error}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
