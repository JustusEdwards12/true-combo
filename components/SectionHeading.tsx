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
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-cyan-500/75">
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
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-500 sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
