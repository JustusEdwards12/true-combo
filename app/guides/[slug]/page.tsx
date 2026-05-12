import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GuidePrevNext } from "@/components/GuidePrevNext";
import { MarkdownContent } from "@/components/MarkdownContent";
import { RelatedGuides } from "@/components/RelatedGuides";
import { TableOfContents } from "@/components/TableOfContents";
import { getAllGuides, getGuideBySlug } from "@/lib/content/load";
import { formatContentDate } from "@/lib/format";
import { getAdjacentGuides } from "@/lib/guide-adjacent";
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
  const toc = extractTocFromMarkdown(content);
  const readMins = readingTimeFromMarkdown(content);
  const updated = data.updated ?? data.date;
  const { prev, next } = getAdjacentGuides(slug);

  return (
    <>
      <ArticleJsonLd
        title={data.title}
        description={data.description}
        path={`/guides/${slug}`}
        datePublished={data.date}
        dateModified={updated}
      />
      <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_220px]">
          <div className="min-w-0">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Guides", href: "/guides" },
                { label: data.title },
              ]}
            />

            <details className="motion-safe:open:shadow-none mt-6 rounded-xl border border-zinc-800/80 bg-zinc-950/50 lg:hidden">
              <summary className="cursor-pointer list-none px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  On this page
                  <span className="text-cyan-500/80" aria-hidden>
                    ↓
                  </span>
                </span>
              </summary>
              <div className="border-t border-zinc-800/80 px-4 py-3">
                <TableOfContents items={toc} />
              </div>
            </details>

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
                  Published{" "}
                  <time dateTime={data.date}>{formatContentDate(data.date)}</time>
                </span>
                {updated !== data.date ? (
                  <span>
                    Updated{" "}
                    <time dateTime={updated}>{formatContentDate(updated)}</time>
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

            <MarkdownContent
              content={content}
              className="prose-guide mt-10 max-w-3xl"
              toc={toc}
            />
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
          </div>

          <aside className="relative mt-10 hidden lg:mt-0 lg:block">
            <div className="sticky top-24 rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-5">
              <TableOfContents items={toc} />
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
