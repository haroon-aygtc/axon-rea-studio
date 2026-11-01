import { Link } from "@tanstack/react-router";

import { Logo } from "@/components/brand/logo";
import { mainNav } from "@/config/navigation";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            Question-driven reverse engineering in your browser. Your files stay on your device.
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"
          aria-label="Footer"
        >
          {mainNav.map((item) => (
            <Link key={item.to} to={item.to} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-7xl px-5 py-5 font-mono text-xs text-muted-foreground md:px-8">
          Only analyse software you own or are authorised to inspect.
        </p>
      </div>
    </footer>
  );
}
