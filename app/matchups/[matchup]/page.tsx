import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MarkdownContent } from "@/components/MarkdownContent";
import { getAllMatchups, getMatchupBySlug } from "@/lib/content/load";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ matchup: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllMatchups().map((m) => ({ matchup: m.data.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { matchup } = await params;
  const doc = getMatchupBySlug(matchup);
  if (!doc) return {};
  return buildMetadata({
    title: doc.data.title,
    description: doc.data.description,
    path: `/matchups/${matchup}`,
    type: "article",
    publishedTime: doc.data.date,
  });
}

export default async function MatchupPage({ params }: Props) {
  const { matchup } = await params;
  const doc = getMatchupBySlug(matchup);
  if (!doc) notFound();

  const { data, content } = doc;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Matchups", href: "/matchups" },
          { label: data.title },
        ]}
      />
      <header className="mt-6 border-b border-zinc-800/80 pb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-cyan-500/90">
          Matchup
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          {data.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-400">
          {data.description}
        </p>
      </header>
      <MarkdownContent content={content} className="mt-10" />
      <aside className="mt-12 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm text-zinc-400">
        <p className="font-medium text-zinc-300">Keep leveling fundamentals</p>
        <p className="mt-2">
          Pair matchup study with{" "}
          <Link
            href="/guides/what-is-neutral"
            className="text-cyan-400 hover:underline"
          >
            neutral planning
          </Link>{" "}
          and{" "}
          <Link href="/guides/how-to-tech" className="text-cyan-400 hover:underline">
            defensive habits
          </Link>
          .
        </p>
      </aside>
    </article>
  );
}
