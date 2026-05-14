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
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800/85 bg-gradient-to-b from-zinc-900/50 to-zinc-950/95 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-[box-shadow,border-color] duration-200 ease-out hover:border-violet-500/35 hover:shadow-[0_22px_50px_-36px_rgba(139,92,246,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/45"
      >
        <span
          className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent opacity-60 transition-opacity group-hover:opacity-100"
          aria-hidden
        />
        <div className="flex items-center justify-between gap-2">
          <span className="rounded border border-violet-500/25 bg-violet-500/10 px-2 py-0.5 font-mono text-xs font-medium uppercase tracking-[0.1em] text-violet-200">
            ROSTER
          </span>
          <span className="font-mono text-xs uppercase tracking-wide text-zinc-500">
            {slug.toUpperCase()}
          </span>
        </div>
        <span className="mt-4 text-xl font-semibold tracking-tight text-zinc-50 transition-colors group-hover:text-violet-100">
          {name}
        </span>
        <p className="mt-3 flex-1 line-clamp-3 text-base leading-relaxed text-zinc-300/90 transition-colors group-hover:text-zinc-200">
          {description}
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-zinc-800/70 pt-4">
          <span className="text-sm font-semibold text-violet-200 transition-transform duration-300 group-hover:translate-x-0.5">
            Loadout →
          </span>
        </div>
      </Link>
    </article>
  );
}
