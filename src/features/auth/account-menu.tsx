import { Link } from "@tanstack/react-router";
import { LayoutDashboard, LogIn, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "./auth-provider";

function initials(email: string | undefined) {
  return (email ?? "?").slice(0, 2).toUpperCase();
}

/** Session-aware account control: sign-in button when signed out, menu when signed in. */
export function AccountMenu({ compact = false }: { compact?: boolean }) {
  const { user, loading, openSignIn, signOut } = useAuth();

  if (loading) return <div className="size-9 animate-pulse rounded-full bg-muted" aria-hidden />;

  if (!user) {
    return (
      <Button size={compact ? "sm" : "default"} variant="outline" onClick={() => openSignIn()}>
        <LogIn />
        Sign in
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="grid size-9 place-items-center rounded-full bg-gradient-ember font-mono text-xs font-semibold text-primary-foreground ring-offset-background transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Account menu"
        >
          {initials(user.email)}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          Signed in as
          <span className="block truncate font-medium text-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard">
            <LayoutDashboard /> Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void signOut()}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
