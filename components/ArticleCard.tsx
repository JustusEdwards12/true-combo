import Link from "next/link";
import { formatContentDate } from "@/lib/format";

export type ArticleCardProps = {
  title: string;
  description: string;
  href: string;
  date?: string;
  category?: string;
  difficulty?: string;
  tags?: string[];
  /** Estimated minutes from markdown body */
  readTimeMinutes?: number;
  /** Larger editorial card for homepage features */
  variant?: "default" | "featured";
  /** Mono micro-label, e.g. "PATCH READ" */
  microLabel?: string;
};

export function ArticleCard({
  title,
  description,
  href,
  date,
  category,
  difficulty,
  tags,
  readTimeMinutes,
  variant = "default",
  microLabel = "ARTICLE",
}: ArticleCardProps) {
  const isFeatured = variant === "featured";
  const cardTypeLabel = href.startsWith("/matchups/")
    ? "matchup strategy"
    : href.startsWith("/guides/")
      ? "Smash Ultimate guide"
      : "analysis";

  return (
    <article className="h-full">
      <Link
        href={href}
        aria-label={`Read ${cardTypeLabel}: ${title}`}
        className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800/85 bg-gradient-to-b from-zinc-900/55 to-zinc-950/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_0_0_1px_rgba(0,0,0,0.35)] outline-none ring-cyan-500/0 transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out focus-visible:ring-2 focus-visible:ring-cyan-500/50 motion-safe:hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-[0_28px_70px_-34px_rgba(34,211,238,0.22),inset_0_1px_0_0_rgba(255,255,255,0.06)] ${
          isFeatured ? "p-7" : "p-5"
        } `}
      >
        <span
          className="pointer-events-none absolute inset-y-3 left-0 w-px bg-gradient-to-b from-cyan-400/0 via-cyan-400/70 to-violet-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden
        />

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded border border-zinc-700/80 bg-zinc-950/60 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            {microLabel}
          </span>
          {category ? (
            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-300/95">
              {category}
            </span>
          ) : null}
          {difficulty ? (
            <span className="rounded border border-zinc-700/60 bg-zinc-900/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              {difficulty}
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] tabular-nums tracking-wide text-zinc-500">
          {date ? (
            <time dateTime={date}>{formatContentDate(date)}</time>
          ) : null}
          {date && readTimeMinutes ? (
            <span className="text-zinc-700" aria-hidden>
              ·
            </span>
          ) : null}
          {readTimeMinutes ? (
            <span className="text-zinc-500">
              {readTimeMinutes} min read
            </span>
          ) : null}
        </div>

        <h3
          className={`mt-3 font-semibold tracking-tight text-zinc-50 transition-colors duration-300 group-hover:text-cyan-50 ${
            isFeatured
              ? "text-xl leading-snug sm:text-2xl"
              : "text-base leading-snug"
          }`}
        >
          {title}
        </h3>
        <p
          className={`mt-2 flex-1 leading-relaxed text-zinc-500 transition-colors duration-300 group-hover:text-zinc-400 ${
            isFeatured ? "line-clamp-3 text-sm sm:text-base" : "line-clamp-2 text-sm"
          }`}
        >
          {description}
        </p>
        {tags && tags.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Topics">
            {tags.slice(0, 4).map((t) => (
              <li
                key={t}
                className="rounded-md border border-zinc-800/90 bg-zinc-950/50 px-2 py-0.5 font-mono text-[10px] text-zinc-500 transition-colors duration-300 group-hover:border-zinc-700/90 group-hover:text-zinc-400"
              >
                {t}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-5 flex items-center justify-between border-t border-zinc-800/70 pt-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 transition-colors group-hover:text-zinc-500">
            KO · READ
          </span>
          <span className="text-xs font-semibold text-cyan-400/90 transition-transform duration-300 group-hover:translate-x-0.5">
            Read guide →
          </span>
        </div>
      </Link>
    </article>
  );
}
