import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleShell } from "@/components/article/ArticleShell";
import { ProgressionLinks } from "@/components/article/ProgressionLinks";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { MarkdownContent } from "@/components/MarkdownContent";
import { RelatedGuides } from "@/components/RelatedGuides";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getAllCharacters, getCharacterBySlug } from "@/lib/content/load";
import { formatContentDate } from "@/lib/format";
import { buildCharacterRoadmapLinks } from "@/lib/guide-structure";
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
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Characters", href: "/characters" },
    { label: data.title },
  ];
  const toc = extractTocFromMarkdown(content);
  const readMins = readingTimeFromMarkdown(content);
  const updated = data.updated ?? data.date;
  const roadmapLinks = buildCharacterRoadmapLinks(doc);

  return (
    <>
      <ArticleJsonLd
        title={data.title}
        description={data.description}
        path={`/characters/${character}`}
        datePublished={data.date}
        dateModified={updated}
      />
      <BreadcrumbJsonLd items={breadcrumbs} />
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
        </header>

        <MarkdownContent content={content} className="mt-10 max-w-3xl" toc={toc} />

        <ProgressionLinks
          title="Character Learning Path"
          subtitle="Use this roadmap to build neutral, punish game, and matchup discipline for this fighter."
          links={roadmapLinks}
        />

        {data.relatedGuides && data.relatedGuides.length > 0 ? (
          <RelatedGuides slugs={data.relatedGuides} />
        ) : null}

        <p className="mt-12 max-w-3xl text-sm leading-relaxed text-zinc-500">
          Sharpen fundamentals with{" "}
          <Link href="/guides/how-to-short-hop" className="text-cyan-400 hover:underline">
            short hops
          </Link>
          ,{" "}
          <Link href="/guides/what-is-neutral" className="text-cyan-400 hover:underline">
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
      </ArticleShell>
    </>
  );
}
