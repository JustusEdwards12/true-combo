import Link from "next/link";
import { getGuideBySlug } from "@/lib/content/load";

type RelatedGuidesProps = {
  slugs: string[];
};

export function RelatedGuides({ slugs }: RelatedGuidesProps) {
  const guides = slugs
    .map((s) => {
      const doc = getGuideBySlug(s);
      return doc ? { slug: s, title: doc.data.title } : null;
    })
    .filter(Boolean) as { slug: string; title: string }[];

  if (guides.length === 0) return null;

  return (
    <aside className="mt-12 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Related guides
      </h2>
      <ul className="mt-4 space-y-2">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/guides/${g.slug}`}
              className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline"
            >
              {g.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
