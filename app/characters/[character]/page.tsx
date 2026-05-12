import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MarkdownContent } from "@/components/MarkdownContent";
import { getAllCharacters, getCharacterBySlug } from "@/lib/content/load";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ character: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCharacters().map((c) => ({ character: c.data.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { character } = await params;
  const doc = getCharacterBySlug(character);
  if (!doc) return {};
  return buildMetadata({
    title: doc.data.title,
    description: doc.data.description,
    path: `/characters/${character}`,
  });
}

export default async function CharacterPage({ params }: Props) {
  const { character } = await params;
  const doc = getCharacterBySlug(character);
  if (!doc) notFound();

  const { data, content } = doc;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Characters", href: "/characters" },
          { label: data.title },
        ]}
      />
      <header className="mt-6 border-b border-zinc-800/80 pb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-cyan-500/90">
          Character guide
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          {data.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-400">
          {data.description}
        </p>
      </header>
      <MarkdownContent content={content} className="mt-10" />
      <p className="mt-12 text-sm text-zinc-500">
        Want more fundamentals first? Start with{" "}
        <Link href="/guides/how-to-short-hop" className="text-cyan-400 hover:underline">
          short hops
        </Link>{" "}
        and{" "}
        <Link href="/guides/what-is-neutral" className="text-cyan-400 hover:underline">
          neutral
        </Link>
        .
      </p>
    </article>
  );
}
