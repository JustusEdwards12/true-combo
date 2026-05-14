import { notFound } from "next/navigation";
import { ArticleShell } from "@/components/article/ArticleShell";
import { RelatedContentPanel } from "@/components/article/RelatedContentPanel";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { MarkdownContent } from "@/components/MarkdownContent";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getAllGlossaryTerms, getGlossaryTermBySlug } from "@/lib/content/load";
import { formatContentDate } from "@/lib/format";
import { scoreGlossaryRelatedConcepts } from "@/lib/related-content";
import { readingTimeFromMarkdown } from "@/lib/read-time";
import { buildMetadata, optimizeMetaDescription } from "@/lib/seo";
import { extractTocFromMarkdown } from "@/lib/toc";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

function toSentenceCase(value: string): string {
  if (!value) return value;
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function pickGlossaryIntroPhrase(term: string): string {
  const lower = term.toLowerCase();

  if (/\b[A-Z]{2,}\b/.test(term) || /\([A-Z]{2,}\)/.test(term)) {
    return "means";
  }

  if (
    lower.includes(" on shield") ||
    lower.includes(" on hit") ||
    lower.includes(" on block")
  ) {
    return "refers to the concept of";
  }

  if (lower.startsWith("neutral")) {
    return "describes";
  }

  if (
    lower.endsWith("state") ||
    lower.endsWith("range") ||
    lower.endsWith("control") ||
    lower.endsWith("pressure") ||
    lower.endsWith("stack") ||
    lower.endsWith("wins")
  ) {
    return "refers to";
  }

  if (lower.endsWith("ing")) {
    return "describes";
  }

  if (!lower.includes(" ")) {
    return "is";
  }

  return "describes";
}

export function generateStaticParams() {
  return getAllGlossaryTerms().map((t) => ({ slug: t.data.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);
  if (!term) return {};
  const title = `What Is ${term.data.title} in Smash Ultimate? | TrueCombo Glossary`;
  const description = `Learn what ${term.data.title} means in Smash Ultimate, why it matters in competitive play, and how to apply it in real matches.`;
  const metaDescription = optimizeMetaDescription(description, {
    fallbackSentence:
      `Understand ${term.data.title} in Smash Ultimate with practical competitive context and clean examples you can apply in matches.`,
  });
  const keywordSet = new Set<string>([
    "Smash Ultimate glossary",
    "Smash Ultimate terms",
    "Smash Ultimate fundamentals",
    `${term.data.title} Smash Ultimate meaning`,
  ]);
  for (const tag of term.data.tags ?? []) {
    keywordSet.add(`Smash Ultimate ${tag} term`);
  }
  return buildMetadata({
    title,
    description: metaDescription,
    path: `/glossary/${slug}`,
    keywords: Array.from(keywordSet).slice(0, 8),
    type: "article",
    publishedTime: term.data.date,
    modifiedTime: term.data.updated ?? term.data.date,
  });
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);
  if (!term) notFound();

  const { data, content } = term;
  const relatedTerms = scoreGlossaryRelatedConcepts(slug, 5);
  const toc = extractTocFromMarkdown(content);
  const readMins = readingTimeFromMarkdown(content);
  const introPhrase = pickGlossaryIntroPhrase(data.title);
  const seoIntroDescription = toSentenceCase(data.description).replace(/\.$/, "");
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: data.title },
  ];

  return (
    <>
      <ArticleJsonLd
        title={`What Is ${data.title} in Smash Ultimate?`}
        description={data.description}
        path={`/glossary/${slug}`}
        datePublished={data.date}
        dateModified={data.updated ?? data.date}
      />
      <BreadcrumbJsonLd items={breadcrumbs} currentPath={`/glossary/${slug}`} />
      <ArticleShell breadcrumbs={breadcrumbs} toc={toc} tocLabel="Term sections">
        <header className="mt-6 border-b border-zinc-800/80 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-cyan-500/25 bg-cyan-500/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-300/95">
              Glossary term
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
          <p className="mt-3 text-sm leading-relaxed text-zinc-500 sm:text-base">
            In Smash Ultimate, {data.title} {introPhrase} {seoIntroDescription}.
          </p>
          <p className="mt-5 font-mono text-[11px] text-zinc-500">
            Published <time dateTime={data.date}>{formatContentDate(data.date)}</time>
          </p>
        </header>
        <MarkdownContent content={content} className="mt-10 max-w-3xl" toc={toc} />
        <RelatedContentPanel
          title="Related Concepts"
          subtitle="Explore connected terms to build a stronger Smash Ultimate decision-making vocabulary."
          chipClassName="bg-zinc-900/55 text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          linksWrapClassName="flex flex-wrap gap-x-2 gap-y-2.5"
          groups={[
            {
              links: relatedTerms,
            },
          ]}
        />
      </ArticleShell>
    </>
  );
}
