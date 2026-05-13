import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleShell } from "@/components/article/ArticleShell";
import { ProgressionLinks } from "@/components/article/ProgressionLinks";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { MarkdownContent } from "@/components/MarkdownContent";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getAllMatchups, getMatchupBySlug } from "@/lib/content/load";
import { formatContentDate } from "@/lib/format";
import {
  buildMatchupConceptLinks,
  buildMatchupNextLinks,
} from "@/lib/guide-structure";
import { readingTimeFromMarkdown } from "@/lib/read-time";
import { buildMetadata } from "@/lib/seo";
import { extractTocFromMarkdown } from "@/lib/toc";

type Props = { params: Promise<{ matchup: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllMatchups().map((m) => ({ matchup: m.data.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { matchup } = await params;
  const doc = getMatchupBySlug(matchup);
  if (!doc) return {};
  const title = /smash ultimate/i.test(doc.data.title)
    ? doc.data.title
    : `${doc.data.title} (Smash Ultimate Matchup Guide)`;
  return buildMetadata({
    title,
    description: doc.data.description,
    path: `/matchups/${matchup}`,
    keywords: [
      "Smash Ultimate matchup guide",
      "Smash Ultimate matchup strategy",
      "competitive Smash adaptation",
    ],
    type: "article",
    publishedTime: doc.data.date,
  });
}

export default async function MatchupPage({ params }: Props) {
  const { matchup } = await params;
  const doc = getMatchupBySlug(matchup);
  if (!doc) notFound();

  const { data, content } = doc;
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Matchups", href: "/matchups" },
    { label: data.title },
  ];
  const toc = extractTocFromMarkdown(content);
  const readMins = readingTimeFromMarkdown(content);
  const updated = data.updated ?? data.date;
  const nextLinks = buildMatchupNextLinks(doc);
  const conceptLinks = buildMatchupConceptLinks(doc).map((c) => ({
    ...c,
    label: "Concept",
  }));

  return (
    <>
      <ArticleJsonLd
        title={data.title}
        description={data.description}
        path={`/matchups/${matchup}`}
        datePublished={data.date}
        dateModified={updated}
      />
      <BreadcrumbJsonLd items={breadcrumbs} currentPath={`/matchups/${matchup}`} />
      <ArticleShell breadcrumbs={breadcrumbs} toc={toc} tocLabel="Matchup sections">
        <header className="mt-6 border-b border-zinc-800/80 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-cyan-500/25 bg-cyan-500/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-300/95">
              Matchup strategy
            </span>
            <span className="font-mono text-[10px] tabular-nums text-zinc-600">
              ~{readMins} min read
            </span>
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl sm:leading-tight">
            {data.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
            {data.description}
          </p>
          <div className="mt-5 font-mono text-[11px] text-zinc-500">
            <span>
              Published <time dateTime={data.date}>{formatContentDate(data.date)}</time>
            </span>
          </div>
        </header>
        <MarkdownContent content={content} className="mt-10 max-w-3xl" toc={toc} />
        <ProgressionLinks
          title="Next Matchup Reads"
          subtitle="Progress through adjacent matchup archetypes to improve adaptation between sets."
          links={nextLinks}
        />
        <ProgressionLinks
          title="Related Concepts"
          subtitle="Reinforce key terminology and decision models that appear in this matchup."
          links={conceptLinks}
        />
        <aside className="mt-12 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm text-zinc-400">
          <p className="font-medium text-zinc-300">Build the full gameplan</p>
          <p className="mt-2 leading-relaxed">
            Pair matchup study with{" "}
            <Link href="/guides/what-is-neutral" className="text-cyan-400 hover:underline">
              neutral planning
            </Link>
            ,{" "}
            <Link href="/guides/how-to-tech" className="text-cyan-400 hover:underline">
              defensive habits
            </Link>
            ,{" "}
            <Link href="/characters" className="text-cyan-400 hover:underline">
              character guides
            </Link>
            , and{" "}
            <Link href="/glossary" className="text-cyan-400 hover:underline">
              matchup glossary terms
            </Link>
            .
          </p>
        </aside>
      </ArticleShell>
    </>
  );
}
