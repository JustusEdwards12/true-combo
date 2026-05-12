import Link from "next/link";

export type CharacterCardProps = {
  name: string;
  description: string;
  slug: string;
};

export function CharacterCard({ name, description, slug }: CharacterCardProps) {
  return (
    <article className="h-full">
      <Link
        href={`/characters/${slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800/85 bg-gradient-to-b from-zinc-900/50 to-zinc-950/95 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-[transform,box-shadow,border-color] duration-300 ease-out motion-safe:hover:-translate-y-1 hover:border-violet-500/25 hover:shadow-[0_28px_70px_-34px_rgba(139,92,246,0.18)]"
      >
        <span
          className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent opacity-60 transition-opacity group-hover:opacity-100"
          aria-hidden
        />
        <div className="flex items-center justify-between gap-2">
          <span className="rounded border border-violet-500/20 bg-violet-500/5 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-violet-200/90">
            ROSTER
          </span>
          <span
            className="flex gap-1 font-mono text-[10px] tabular-nums text-zinc-600"
            aria-hidden
          >
            <span className="h-2 w-2 rounded-sm border border-zinc-600 bg-zinc-800 transition-colors group-hover:border-cyan-500/50 group-hover:bg-cyan-500/20" />
            <span className="h-2 w-2 rounded-sm border border-zinc-600 bg-zinc-800 transition-colors group-hover:border-cyan-500/50 group-hover:bg-cyan-500/20" />
            <span className="h-2 w-2 rounded-sm border border-zinc-600 bg-zinc-800 transition-colors group-hover:border-cyan-500/50 group-hover:bg-cyan-500/20" />
          </span>
        </div>
        <span className="mt-5 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
          ID · {slug.toUpperCase()}
        </span>
        <span className="mt-2 text-xl font-semibold tracking-tight text-zinc-50 transition-colors group-hover:text-violet-100">
          {name}
        </span>
        <p className="mt-3 flex-1 line-clamp-3 text-sm leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-400">
          {description}
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-zinc-800/70 pt-4">
          <span className="font-mono text-[10px] text-zinc-600">
            FRAME 1 · SELECT
          </span>
          <span className="text-xs font-semibold text-violet-300/90 transition-transform duration-300 group-hover:translate-x-0.5">
            Loadout →
          </span>
        </div>
      </Link>
    </article>
  );
}
