type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  /** Small mono kicker, e.g. "PATCH NOTES" */
  kicker?: string;
  id?: string;
  className?: string;
};

export function SectionHeading({
  title,
  subtitle,
  kicker,
  id,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {kicker ? (
        <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-cyan-400/85">
          {kicker}
        </p>
      ) : null}
      <h2
        id={id}
        className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
