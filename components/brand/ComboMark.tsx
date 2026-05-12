type ComboMarkProps = {
  className?: string;
  "aria-hidden"?: boolean;
};

/**
 * Minimal combo-chain / bracket emblem—no IP, HUD-inspired geometry only.
 */
export function ComboMark({
  className = "h-9 w-9 shrink-0",
  ...rest
}: ComboMarkProps) {
  return (
    <svg
      className={`text-cyan-400/90 ${className}`}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M6 22 L12 14 L18 20 L24 10 L30 16"
        className="tc-logo-stroke opacity-90 transition-opacity duration-300 group-hover:opacity-100"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <circle cx="12" cy="14" r="2.25" fill="currentColor" className="opacity-90" />
      <circle
        cx="18"
        cy="20"
        r="2.25"
        fill="currentColor"
        className="motion-safe:tc-logo-node"
      />
      <circle cx="24" cy="10" r="2.25" fill="currentColor" className="opacity-80" />
      <path
        d="M8 28 h20"
        stroke="url(#tc-mark-fade)"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.45"
      />
      <defs>
        <linearGradient id="tc-mark-fade" x1="8" y1="28" x2="28" y2="28">
          <stop stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.5" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
