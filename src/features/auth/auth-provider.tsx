import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { SignInDialog } from "./sign-in-dialog";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  /** Opens the sign-in dialog. `reason` explains why sign-in is needed. */
  openSignIn: (reason?: string) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState<{ open: boolean; reason?: string | undefined }>({ open: false });

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
      if (next) setDialog({ open: false });
    });
    void supabase.auth.getSession().then(({ data: current }) => {
      setSession(current.session);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const openSignIn = useCallback((reason?: string) => setDialog({ open: true, reason }), []);
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ session, user: session?.user ?? null, loading, openSignIn, signOut }),
    [session, loading, openSignIn, signOut],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <SignInDialog
        open={dialog.open}
        reason={dialog.reason}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
      />
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
