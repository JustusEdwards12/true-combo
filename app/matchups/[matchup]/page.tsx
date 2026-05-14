import { notFound } from "next/navigation";
import { ArticleShell } from "@/components/article/ArticleShell";
import { RelatedContentPanel } from "@/components/article/RelatedContentPanel";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { MarkdownContent } from "@/components/MarkdownContent";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getMatchupBySlug, getAllMatchups } from "@/lib/content/load";
import { formatContentDate } from "@/lib/format";
import { scoreMatchupRelatedContent } from "@/lib/related-content";
import { readingTimeFromMarkdown } from "@/lib/read-time";
import { buildMetadata, optimizeMetaDescription } from "@/lib/seo";
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
  const baseTitle = doc.data.title.trim();
  const withGuideWord = /(matchup guide|fundamentals|guide)/i.test(baseTitle)
    ? baseTitle
    : `${baseTitle} Matchup Guide`;
  const title = /smash ultimate/i.test(withGuideWord)
    ? withGuideWord
    : `${withGuideWord} (Smash Ultimate)`;
  const description = /smash ultimate/i.test(doc.data.description)
    ? doc.data.description
    : `${doc.data.description} Practical Smash Ultimate matchup guide.`;
  const metaDescription = optimizeMetaDescription(description, {
    fallbackSentence:
      "Learn practical Smash Ultimate matchup counterplay, neutral priorities, and set adaptation for this matchup.",
  });
  const keywordSet = new Set<string>([
    "Smash Ultimate matchup guide",
    "Smash Ultimate counterplay",
    "Smash Ultimate neutral strategy",
  ]);
  for (const tag of doc.data.tags ?? []) {
    keywordSet.add(`Smash Ultimate ${tag} matchup`);
  }
  return buildMetadata({
    title,
    description: metaDescription,
    path: `/matchups/${matchup}`,
    keywords: Array.from(keywordSet).slice(0, 8),
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
  const { matchups: connectedMatchups, fighters: characterLinks } =
    scoreMatchupRelatedContent(matchup, 6, 5);

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
              {readMins} min read
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
        <RelatedContentPanel
          title="Connected Matchups"
          subtitle="Expand your set prep with adjacent matchup reads and relevant fighter pages."
          chipClassName="px-3.5 border-zinc-600/85 bg-zinc-900/55 text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          groupLabelClassName="mb-1.5 text-zinc-400"
          groupsWrapClassName="mt-4 space-y-3"
          linksWrapClassName="flex flex-wrap gap-x-2 gap-y-2"
          groups={[
            { title: "More Matchup Guides", links: connectedMatchups },
            { title: "Related Fighters", links: characterLinks },
          ]}
        />
      </ArticleShell>
    </>
  );
}
