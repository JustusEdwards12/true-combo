import { notFound } from "next/navigation";
import { ArticleShell } from "@/components/article/ArticleShell";
import { RelatedContentPanel } from "@/components/article/RelatedContentPanel";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { MarkdownContent } from "@/components/MarkdownContent";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getAllCharacters, getCharacterBySlug } from "@/lib/content/load";
import {
  buildCharacterGuideDisplayTitle,
  buildCharacterGuideSeoTitle,
  getCharacterNameFromTitle,
} from "@/lib/character-title";
import { formatContentDate } from "@/lib/format";
import { scoreCharacterRelatedContent } from "@/lib/related-content";
import { readingTimeFromMarkdown } from "@/lib/read-time";
import { buildMetadata, optimizeMetaDescription } from "@/lib/seo";
import { extractTocFromMarkdown } from "@/lib/toc";

type Props = { params: Promise<{ character: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCharacters().map((c) => ({ character: c.data.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { character } = await params;
  const doc = getCharacterBySlug(character);
  if (!doc) return {};
  const modified = doc.data.updated ?? doc.data.date;
  const characterName = getCharacterNameFromTitle(doc.data.title);
  const title = buildCharacterGuideSeoTitle(characterName);
  const description = /smash ultimate/i.test(doc.data.description)
    ? doc.data.description
    : `${doc.data.description} Practical Smash Ultimate character guide.`;
  const metaDescription = optimizeMetaDescription(description, {
    fallbackSentence:
      "Learn practical Smash Ultimate character gameplans, key moves, and matchup habits you can apply in tournament sets.",
  });
  const keywordSet = new Set<string>([
    "Smash Ultimate character guide",
    "Smash Ultimate frame data priorities",
    "Smash Ultimate matchup tips",
  ]);
  keywordSet.add(`${doc.data.title} Smash Ultimate guide`);
  for (const tag of doc.data.tags ?? []) {
    keywordSet.add(`Smash Ultimate ${tag}`);
  }
  return buildMetadata({
    title,
    description: metaDescription,
    path: `/characters/${character}`,
    keywords: Array.from(keywordSet).slice(0, 8),
    type: "article",
    publishedTime: doc.data.date,
    modifiedTime: modified,
  });
}

export default async function CharacterPage({ params }: Props) {
  const { character } = await params;
  const doc = getCharacterBySlug(character);
  if (!doc) notFound();

  const { data, content } = doc;
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Characters", href: "/characters" },
    { label: data.title },
  ];
  const toc = extractTocFromMarkdown(content);
  const readMins = readingTimeFromMarkdown(content);
  const updated = data.updated ?? data.date;
  const characterName = getCharacterNameFromTitle(data.title);
  const displayTitle = buildCharacterGuideDisplayTitle(characterName);
  const { guides: relatedGuides, fighters: relatedFighters } =
    scoreCharacterRelatedContent(character, 5, 5);

  return (
    <>
      <ArticleJsonLd
        title={data.title}
        description={data.description}
        path={`/characters/${character}`}
        datePublished={data.date}
        dateModified={updated}
      />
      <BreadcrumbJsonLd items={breadcrumbs} currentPath={`/characters/${character}`} />
      <ArticleShell
        breadcrumbs={breadcrumbs}
        toc={toc}
        tocAccentClassName="text-violet-400/80"
      >
        <header className="mt-6 border-b border-zinc-800/80 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-violet-500/25 bg-violet-500/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-200/95">
              Character guide
            </span>
            {data.difficulty ? (
              <span className="rounded border border-zinc-700/70 bg-zinc-900/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                {data.difficulty}
              </span>
            ) : null}
            <span className="font-mono text-[10px] tabular-nums text-zinc-600">
              {readMins} min read
            </span>
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl sm:leading-tight">
            {displayTitle}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
            {data.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-zinc-500">
            <span>
              Published <time dateTime={data.date}>{formatContentDate(data.date)}</time>
            </span>
            {updated !== data.date ? (
              <span>
                Updated <time dateTime={updated}>{formatContentDate(updated)}</time>
              </span>
            ) : null}
          </div>
        </header>

        <MarkdownContent content={content} className="mt-10 max-w-3xl" toc={toc} />

        <RelatedContentPanel
          title="Character Ecosystem"
          subtitle="Build deeper matchup awareness with related fighters, strategic concepts, and improvement guides."
          groupLabelClassName="mb-1.5 text-zinc-400/95"
          groupsWrapClassName="mt-4 space-y-3.5"
          linksWrapClassName="flex flex-wrap gap-x-2 gap-y-2.5"
          groups={[
            { title: "Related Guides", links: relatedGuides },
            { title: "Related Fighters", links: relatedFighters },
          ]}
        />
      </ArticleShell>
    </>
  );
}
