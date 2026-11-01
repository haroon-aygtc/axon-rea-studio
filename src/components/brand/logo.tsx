import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  withWordmark?: boolean;
}

/** REA mark: a stylised "A" cut by an ember sweep with three data bits. */
export function Logo({ className, withWordmark = true }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg width="30" height="30" viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
        <rect
          x="3"
          y="3"
          width="34"
          height="34"
          rx="9"
          className="fill-paper stroke-ember"
          strokeWidth="1.5"
        />
        <path d="M12 29L19 11H23L29 29H24.5L21.2 19L16.5 29Z" className="fill-ink" />
        <path d="M11 28C17 20 24 16 30 15C25 19 19 24 15 29Z" className="fill-rust" />
        <g className="fill-ember">
          <rect x="30" y="8" width="3" height="3" />
          <rect x="27" y="11" width="3" height="3" />
          <rect x="33" y="11" width="3" height="3" />
        </g>
      </svg>
      {withWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight">
          REA<span className="text-primary">.</span>Studio
        </span>
      )}
    </span>
  );
}
