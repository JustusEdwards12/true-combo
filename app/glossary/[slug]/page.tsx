import { notFound } from "next/navigation";
import { ArticleShell } from "@/components/article/ArticleShell";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { MarkdownContent } from "@/components/MarkdownContent";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getAllGlossaryTerms, getGlossaryTermBySlug } from "@/lib/content/load";
import { formatContentDate } from "@/lib/format";
import { readingTimeFromMarkdown } from "@/lib/read-time";
import { buildMetadata } from "@/lib/seo";
import { extractTocFromMarkdown } from "@/lib/toc";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGlossaryTerms().map((t) => ({ slug: t.data.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);
  if (!term) return {};
  return buildMetadata({
    title: `${term.data.title} (Smash Ultimate glossary)`,
    description: term.data.description,
    path: `/glossary/${slug}`,
    keywords: [
      "Smash Ultimate glossary",
      `${term.data.title} Smash Ultimate`,
      "Smash terminology",
    ],
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
  const toc = extractTocFromMarkdown(content);
  const readMins = readingTimeFromMarkdown(content);
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: data.title },
  ];

  return (
    <>
      <ArticleJsonLd
        title={`${data.title} - Smash Ultimate Glossary`}
        description={data.description}
        path={`/glossary/${slug}`}
        datePublished={data.date}
        dateModified={data.updated ?? data.date}
      />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ArticleShell breadcrumbs={breadcrumbs} toc={toc} tocLabel="Term sections">
        <header className="mt-6 border-b border-zinc-800/80 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-cyan-500/25 bg-cyan-500/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-300/95">
              Glossary term
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
          <p className="mt-5 font-mono text-[11px] text-zinc-500">
            Published <time dateTime={data.date}>{formatContentDate(data.date)}</time>
          </p>
        </header>
        <MarkdownContent content={content} className="mt-10 max-w-3xl" toc={toc} />
      </ArticleShell>
    </>
  );
}
