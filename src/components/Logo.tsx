import { cn } from "~/lib/utils";

/**
 * The mashadi.io mark: a lowercase "m" drawn as two pointed arches, closed by
 * the dot of ".io". Navy comes from the text colour, the dot from the brand
 * blue. The viewBox ends at the feet so the mark sits on a text baseline.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="5 8 55 43.5"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M9 51V30C9 21.5 14 18 18.5 13.5C23 18 28 21.5 28 30V51M28 30C28 21.5 33 18 37.5 13.5C42 18 47 21.5 47 30V51"
        stroke="currentColor"
        strokeWidth="4.6"
        strokeMiterlimit="10"
      />
      <circle cx="55" cy="48.2" r="3" className="fill-brand" />
    </svg>
  );
}

/**
 * Mark plus the "mashadi.io" wordmark. Everything is sized in em, so the
 * font size on `className` scales the whole logo.
 */
export default function Logo({
  layout = "inline",
  className,
}: {
  layout?: "inline" | "stacked";
  className?: string;
}) {
  const stacked = layout === "stacked";
  return (
    <span
      className={cn(
        "inline-flex font-serif leading-none text-foreground",
        stacked ? "flex-col items-center gap-[0.42em]" : "items-baseline gap-[0.34em]",
        className,
      )}
    >
      <LogoMark className={stacked ? "h-[1.5em] w-auto" : "h-[0.82em] w-auto"} />
      <span className="tracking-[-0.01em]">
        mashadi<span className="text-brand">.io</span>
      </span>
    </span>
  );
}
