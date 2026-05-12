import { notFound } from "next/navigation";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MarkdownContent } from "@/components/MarkdownContent";
import { RelatedGuides } from "@/components/RelatedGuides";
import { getAllGuides, getGuideBySlug } from "@/lib/content/load";
import { formatContentDate } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGuides().map((g) => ({ slug: g.data.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const doc = getGuideBySlug(slug);
  if (!doc) return {};
  return buildMetadata({
    title: doc.data.title,
    description: doc.data.description,
    path: `/guides/${slug}`,
    type: "article",
    publishedTime: doc.data.date,
  });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const doc = getGuideBySlug(slug);
  if (!doc) notFound();

  const { data, content } = doc;

  return (
    <>
      <ArticleJsonLd
        title={data.title}
        description={data.description}
        path={`/guides/${slug}`}
        datePublished={data.date}
      />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: data.title },
          ]}
        />
        <header className="mt-6 border-b border-zinc-800/80 pb-8">
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-zinc-500">
            {data.category ? (
              <span className="text-cyan-500/90">{data.category}</span>
            ) : null}
            {data.difficulty ? (
              <span className="text-zinc-600">· {data.difficulty}</span>
            ) : null}
            <span className="text-zinc-600">·</span>
            <time dateTime={data.date}>{formatContentDate(data.date)}</time>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            {data.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            {data.description}
          </p>
          {data.tags && data.tags.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-2">
              {data.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-md bg-zinc-800/80 px-2.5 py-1 text-xs text-zinc-400"
                >
                  {t}
                </li>
              ))}
            </ul>
          ) : null}
        </header>
        <MarkdownContent content={content} className="prose-guide mt-10" />
        {data.relatedGuides && data.relatedGuides.length > 0 ? (
          <RelatedGuides slugs={data.relatedGuides} />
        ) : null}
      </article>
    </>
  );
}
