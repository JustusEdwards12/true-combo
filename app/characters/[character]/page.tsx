import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MarkdownContent } from "@/components/MarkdownContent";
import { RelatedGuides } from "@/components/RelatedGuides";
import { TableOfContents } from "@/components/TableOfContents";
import { getAllCharacters, getCharacterBySlug } from "@/lib/content/load";
import { formatContentDate } from "@/lib/format";
import { readingTimeFromMarkdown } from "@/lib/read-time";
import { buildMetadata } from "@/lib/seo";
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
  const title = /smash ultimate/i.test(doc.data.title)
    ? doc.data.title
    : `${doc.data.title} Character Guide for Smash Ultimate`;
  return buildMetadata({
    title,
    description: doc.data.description,
    path: `/characters/${character}`,
    keywords: [
      "Smash Ultimate character guide",
      `${doc.data.title} Smash Ultimate guide`,
      "Smash Ultimate beginner improvement",
    ],
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
  const toc = extractTocFromMarkdown(content);
  const readMins = readingTimeFromMarkdown(content);
  const updated = data.updated ?? data.date;

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="min-w-0">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Characters", href: "/characters" },
              { label: data.title },
            ]}
          />

          <details className="mt-6 rounded-xl border border-zinc-800/80 bg-zinc-950/50 lg:hidden">
            <summary className="cursor-pointer list-none px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between">
                On this page
                <span className="text-violet-400/80" aria-hidden>
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
              <span className="rounded-full border border-violet-500/25 bg-violet-500/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-200/95">
                Character guide
              </span>
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
          </header>

          <MarkdownContent
            content={content}
            className="mt-10 max-w-3xl"
            toc={toc}
          />

          {data.relatedGuides && data.relatedGuides.length > 0 ? (
            <RelatedGuides slugs={data.relatedGuides} />
          ) : null}

          <p className="mt-12 max-w-3xl text-sm leading-relaxed text-zinc-500">
            Sharpen fundamentals with{" "}
            <Link
              href="/guides/how-to-short-hop"
              className="text-cyan-400 hover:underline"
            >
              short hops
            </Link>
            ,{" "}
            <Link
              href="/guides/what-is-neutral"
              className="text-cyan-400 hover:underline"
            >
              neutral framing
            </Link>
            , and{" "}
            <Link
              href="/guides/best-beginner-characters"
              className="text-cyan-400 hover:underline"
            >
              roster picks for learning
            </Link>
            , plus{" "}
            <Link href="/matchups" className="text-cyan-400 hover:underline">
              matchup strategy
            </Link>{" "}
            and{" "}
            <Link href="/glossary" className="text-cyan-400 hover:underline">
              glossary terms
            </Link>
            .
          </p>
        </div>

        <aside className="relative mt-10 hidden lg:mt-0 lg:block">
          <div className="sticky top-24 rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-5">
            <TableOfContents items={toc} />
          </div>
        </aside>
      </div>
    </article>
  );
}
