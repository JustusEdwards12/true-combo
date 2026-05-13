import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleShell } from "@/components/article/ArticleShell";
import { FAQSection } from "@/components/article/FAQSection";
import { KeyTakeawayBox } from "@/components/article/KeyTakeawayBox";
import { ProgressionLinks } from "@/components/article/ProgressionLinks";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { GuidePrevNext } from "@/components/GuidePrevNext";
import { MarkdownContent } from "@/components/MarkdownContent";
import { RelatedGuides } from "@/components/RelatedGuides";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { getAllGuides, getGuideBySlug } from "@/lib/content/load";
import { formatContentDate } from "@/lib/format";
import { getAdjacentGuides } from "@/lib/guide-adjacent";
import {
  buildGuideConceptLinks,
  buildGuideProgressionLinks,
  extractFaqFromMarkdown,
  extractFirstBulletPoints,
} from "@/lib/guide-structure";
import { readingTimeFromMarkdown } from "@/lib/read-time";
import { buildMetadata } from "@/lib/seo";
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
  const title = /smash ultimate/i.test(doc.data.title)
    ? doc.data.title
    : `${doc.data.title} (Smash Ultimate Guide)`;
  return buildMetadata({
    title,
    description: doc.data.description,
    path: `/guides/${slug}`,
    keywords: [
      "Smash Ultimate guide",
      "Smash Ultimate beginner improvement",
      "competitive Smash mechanics",
    ],
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
  const conceptLinks = buildGuideConceptLinks(doc).map((c) => ({
    ...c,
    label: "Concept",
  }));

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
              <span className="rounded-full border border-cyan-500/25 bg-cyan-500/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-300/95">
                {data.category}
              </span>
            ) : null}
            {data.difficulty ? (
              <span className="rounded border border-zinc-700/70 bg-zinc-900/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                {data.difficulty}
              </span>
            ) : null}
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
          {data.tags && data.tags.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Topics">
              {data.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-md border border-zinc-800/90 bg-zinc-900/50 px-2.5 py-1 font-mono text-[11px] text-zinc-400"
                >
                  {t}
                </li>
              ))}
            </ul>
          ) : null}
        </header>

        <KeyTakeawayBox items={keyTakeaways} />

        <MarkdownContent content={content} className="prose-guide mt-10 max-w-3xl" toc={toc} />

        <ProgressionLinks
          title="Recommended Next Guides"
          subtitle="Follow the progression path to build mechanics, decision-making, and matchup consistency in order."
          links={progressionLinks}
        />
        <ProgressionLinks
          title="Related Concepts"
          subtitle="Use these glossary concepts to sharpen decision quality while practicing this lesson."
          links={conceptLinks}
        />

        <FAQSection items={faqItems} />

        <aside className="mt-10 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm text-zinc-400">
          <p className="font-medium text-zinc-300">
            Continue your Smash Ultimate improvement path
          </p>
          <p className="mt-2 leading-relaxed">
            Pair this guide with{" "}
            <Link href="/guides#beginner" className="text-cyan-400 hover:underline">
              beginner mechanics guides
            </Link>
            ,{" "}
            <Link href="/characters" className="text-cyan-400 hover:underline">
              character guides
            </Link>
            ,{" "}
            <Link href="/matchups" className="text-cyan-400 hover:underline">
              matchup strategy
            </Link>
            , and{" "}
            <Link href="/glossary" className="text-cyan-400 hover:underline">
              glossary terms
            </Link>
            .
          </p>
        </aside>
        {data.relatedGuides && data.relatedGuides.length > 0 ? (
          <RelatedGuides slugs={data.relatedGuides} />
        ) : null}
        <GuidePrevNext prev={prev} next={next} />
      </ArticleShell>
    </>
  );
}
