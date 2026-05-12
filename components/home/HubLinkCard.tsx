import Link from "next/link";

type Phase = "neutral" | "advantage" | "punish" | "confirm";

const phaseStyle: Record<
  Phase,
  { bar: string; tag: string; tagText: string }
> = {
  neutral: {
    bar: "from-amber-400/80 to-amber-500/0",
    tag: "border-amber-500/25 bg-amber-500/5 text-amber-200/90",
    tagText: "NEUTRAL",
  },
  advantage: {
    bar: "from-cyan-400/80 to-cyan-500/0",
    tag: "border-cyan-500/25 bg-cyan-500/5 text-cyan-200/90",
    tagText: "ADV",
  },
  punish: {
    bar: "from-violet-400/80 to-violet-600/0",
    tag: "border-violet-500/25 bg-violet-500/5 text-violet-200/90",
    tagText: "PUNISH",
  },
  confirm: {
    bar: "from-rose-400/80 to-rose-600/0",
    tag: "border-rose-500/25 bg-rose-500/5 text-rose-200/90",
    tagText: "CONFIRM",
  },
};

export type HubLinkCardProps = {
  index: string;
  title: string;
  description: string;
  href: string;
  phase: Phase;
  framesLabel: string;
};

export function HubLinkCard({
  index,
  title,
  description,
  href,
  phase,
  framesLabel,
}: HubLinkCardProps) {
  const p = phaseStyle[phase];
  return (
    <li>
      <Link
        href={href}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-950/40 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out motion-safe:hover:-translate-y-1 hover:border-zinc-700/90 hover:bg-zinc-900/35 hover:shadow-[0_24px_60px_-28px_rgba(34,211,238,0.18)]"
      >
        <span
          className={`pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r ${p.bar} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
          aria-hidden
        />
        <div className="flex items-start justify-between gap-3">
          <span className="font-mono text-[10px] font-medium tabular-nums tracking-widest text-zinc-600 transition-colors duration-300 group-hover:text-zinc-400">
            {index}
          </span>
          <span
            className={`rounded border px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] ${p.tag}`}
          >
            {p.tagText}
          </span>
        </div>
        <span className="mt-5 text-lg font-semibold tracking-tight text-zinc-50 transition-colors duration-300 group-hover:text-cyan-100">
          {title}
        </span>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500 transition-colors duration-300 group-hover:text-zinc-400">
          {description}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-zinc-800/80 pt-4">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
            {framesLabel}
          </span>
          <span className="text-xs font-semibold text-cyan-400/90 transition-transform duration-300 group-hover:translate-x-0.5">
            Enter lane →
          </span>
        </div>
      </Link>
    </li>
  );
}
