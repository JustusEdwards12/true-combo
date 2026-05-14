import { notFound } from "next/navigation";
import { ArticleShell } from "@/components/article/ArticleShell";
import { FAQSection } from "@/components/article/FAQSection";
import { KeyTakeawayBox } from "@/components/article/KeyTakeawayBox";
import { ProgressionLinks } from "@/components/article/ProgressionLinks";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { GuidePrevNext } from "@/components/GuidePrevNext";
import { MarkdownContent } from "@/components/MarkdownContent";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { getAllGuides, getGuideBySlug } from "@/lib/content/load";
import { formatContentDate } from "@/lib/format";
import { getAdjacentGuides } from "@/lib/guide-adjacent";
import {
  buildGuideProgressionLinks,
  extractFaqFromMarkdown,
  extractFirstBulletPoints,
} from "@/lib/guide-structure";
import { readingTimeFromMarkdown } from "@/lib/read-time";
import { buildMetadata, optimizeMetaDescription } from "@/lib/seo";
import { extractTocFromMarkdown } from "@/lib/toc";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGuides().map((g) => ({ slug: g.data.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const doc = getGuideBySlug(slug);
  if (!doc) return {};
  const modified = doc.data.updated ?? doc.data.date;
  const baseTitle = doc.data.title.trim();
  const title = /smash ultimate/i.test(baseTitle)
    ? baseTitle
    : `${baseTitle} in Smash Ultimate`;
  const description = /smash ultimate/i.test(doc.data.description)
    ? doc.data.description
    : `${doc.data.description} Practical Smash Ultimate guide.`;
  const metaDescription = optimizeMetaDescription(description, {
    fallbackSentence:
      "Learn practical Smash Ultimate fundamentals for neutral, advantage state, and matchup-ready decision-making.",
  });
  const keywordSet = new Set<string>([
    "Smash Ultimate guide",
    "Smash Ultimate beginner guide",
    "Smash Ultimate fundamentals",
  ]);
  if (doc.data.category) {
    keywordSet.add(`Smash Ultimate ${doc.data.category.toLowerCase()} guide`);
  }
  for (const tag of doc.data.tags ?? []) {
    keywordSet.add(`Smash Ultimate ${tag}`);
  }
  return buildMetadata({
    title,
    description: metaDescription,
    path: `/guides/${slug}`,
    keywords: Array.from(keywordSet).slice(0, 8),
    type: "article",
    publishedTime: doc.data.date,
    modifiedTime: modified,
  });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const doc = getGuideBySlug(slug);
  if (!doc) notFound();

  const { data, content } = doc;
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: data.title },
  ];
  const toc = extractTocFromMarkdown(content);
  const readMins = readingTimeFromMarkdown(content);
  const updated = data.updated ?? data.date;
  const { prev, next } = getAdjacentGuides(slug);
  const keyTakeaways =
    data.keyTakeaways && data.keyTakeaways.length > 0
      ? data.keyTakeaways
      : extractFirstBulletPoints(content, 4);
  const faqItems =
    data.faqs && data.faqs.length > 0 ? data.faqs : extractFaqFromMarkdown(content);
  const progressionLinks = buildGuideProgressionLinks(slug);

  return (
    <>
      <ArticleJsonLd
        title={data.title}
        description={data.description}
        path={`/guides/${slug}`}
        datePublished={data.date}
        dateModified={updated}
      />
      <BreadcrumbJsonLd items={breadcrumbs} currentPath={`/guides/${slug}`} />
      <FAQJsonLd items={faqItems} />
      <ArticleShell breadcrumbs={breadcrumbs} toc={toc}>
        <header className="mt-6 border-b border-zinc-800/80 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            {data.category ? (
              <span className="rounded-full border border-cyan-500/25 bg-cyan-500/5 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-cyan-300/95">
                {data.category}
              </span>
            ) : null}
            {data.difficulty ? (
              <span className="rounded border border-zinc-700/70 bg-zinc-900/60 px-2 py-0.5 font-mono text-xs uppercase tracking-wide text-zinc-300">
                {data.difficulty}
              </span>
            ) : null}
            <span className="font-mono text-xs tabular-nums text-zinc-500">
              {readMins} min read
            </span>
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl sm:leading-tight">
            {data.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-300 sm:text-lg">
            {data.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-zinc-400">
            <span>
              Published <time dateTime={data.date}>{formatContentDate(data.date)}</time>
            </span>
            {updated !== data.date ? (
              <span>
                Updated <time dateTime={updated}>{formatContentDate(updated)}</time>
              </span>
            ) : null}
          </div>
          {data.tags && data.tags.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Topics">
              {data.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-md border border-zinc-800/90 bg-zinc-900/50 px-2.5 py-1 font-mono text-xs text-zinc-300"
                >
                  {t}
                </li>
              ))}
            </ul>
          ) : null}
        </header>

        <KeyTakeawayBox items={keyTakeaways} />

        <MarkdownContent content={content} className="prose-guide mt-10 max-w-3xl" toc={toc} />

        <FAQSection items={faqItems} />
        <ProgressionLinks
          title="Continue Learning"
          subtitle="A curated next-step path to build fundamentals, then layer in higher-value concepts for match-ready improvement."
          links={progressionLinks}
        />
        <GuidePrevNext prev={prev} next={next} />
      </ArticleShell>
    </>
  );
}
