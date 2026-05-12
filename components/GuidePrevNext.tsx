import Link from "next/link";
import type { GuideFrontmatter, ParsedDoc } from "@/lib/content/types";

type GuidePrevNextProps = {
  prev: ParsedDoc<GuideFrontmatter> | null;
  next: ParsedDoc<GuideFrontmatter> | null;
};

export function GuidePrevNext({ prev, next }: GuidePrevNextProps) {
  if (!prev && !next) return null;

  return (
    <nav
      className="mt-14 grid gap-4 border-t border-zinc-800/80 pt-10 sm:grid-cols-2"
      aria-label="Previous and next guides"
    >
      <div>
        {prev ? (
          <Link
            href={`/guides/${prev.data.slug}`}
            className="group block rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 transition-colors hover:border-cyan-500/25 hover:bg-zinc-900/40"
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
              ← Previous
            </span>
            <span className="mt-1 block text-sm font-semibold text-zinc-200 transition-colors group-hover:text-cyan-300">
              {prev.data.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
      </div>
      <div className="sm:text-right">
        {next ? (
          <Link
            href={`/guides/${next.data.slug}`}
            className="group block rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 transition-colors hover:border-cyan-500/25 hover:bg-zinc-900/40"
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
              Next →
            </span>
            <span className="mt-1 block text-sm font-semibold text-zinc-200 transition-colors group-hover:text-cyan-300">
              {next.data.title}
            </span>
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
