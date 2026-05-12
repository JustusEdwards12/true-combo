import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MarkdownContent } from "@/components/MarkdownContent";
import { getAllGlossaryTerms } from "@/lib/content/load";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Smash Ultimate Glossary",
  description:
    "Definitions of common Smash Ultimate and competitive fighting game terms for beginners and tournament-focused players.",
  path: "/glossary",
  keywords: [
    "Smash Ultimate glossary",
    "Smash Ultimate terms",
    "fighting game terminology",
  ],
});

export default function GlossaryPage() {
  const terms = [...getAllGlossaryTerms()].sort((a, b) =>
    a.data.title.localeCompare(b.data.title),
  );

  return (
    <div
      id="top"
      className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16"
    >
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Glossary" }]} />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-50">
        Smash Ultimate Glossary
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
        Quick definitions you can reference between games—precise language, no
        fluff.
      </p>

      <nav
        aria-label="Glossary terms"
        className="mt-10 flex flex-wrap gap-2 border-b border-zinc-800/80 pb-10"
      >
        {terms.map(({ data }) => (
          <a
            key={data.slug}
            href={`#${data.slug}`}
            className="rounded-md bg-zinc-800/60 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-cyan-400"
          >
            {data.title}
          </a>
        ))}
      </nav>

      <div className="divide-y divide-zinc-800/80">
        {terms.map(({ data, content }) => (
          <section key={data.slug} id={data.slug} className="scroll-mt-24 py-12">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-100">
              {data.title}
            </h2>
            <p className="mt-2 text-sm text-zinc-500">{data.description}</p>
            <MarkdownContent content={content} className="mt-6" />
            <p className="mt-6 text-xs text-zinc-600">
              <Link href="#top" className="hover:text-cyan-400">
                Back to top
              </Link>
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
