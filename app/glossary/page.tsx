import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
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
        Core competitive terms, coaching definitions, and practical examples you
        can apply in real sets.
      </p>

      <nav aria-label="Glossary terms" className="mt-10">
        <div className="grid gap-3 sm:grid-cols-2">
          {terms.map(({ data }) => (
            <Link
              key={data.slug}
              href={`/glossary/${data.slug}`}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/35 px-4 py-3 transition-colors hover:border-cyan-500/35 hover:bg-cyan-500/[0.06]"
            >
              <p className="text-sm font-semibold text-zinc-100">{data.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                {data.description}
              </p>
            </Link>
          ))}
        </div>
      </nav>

      <div className="mt-12 divide-y divide-zinc-800/80">
        {terms.map(({ data }) => (
          <section key={data.slug} id={data.slug} className="scroll-mt-24 py-12">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-100">
              {data.title}
            </h2>
            <p className="mt-2 text-sm text-zinc-500">{data.description}</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              Open the full term page for practical examples, common
              misunderstandings, and drill-ready application notes.
            </p>
            <p className="mt-4">
              <Link
                href={`/glossary/${data.slug}`}
                className="text-sm font-semibold text-cyan-400 hover:text-cyan-300"
              >
                Read full term →
              </Link>
            </p>
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
