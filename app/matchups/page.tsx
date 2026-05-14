import { ArticleCard } from "@/components/ArticleCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getAllMatchups, sortByDateDesc } from "@/lib/content/load";
import { readingTimeFromMarkdown } from "@/lib/read-time";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Smash Ultimate Matchup Guides and Counterplay",
  description:
    "Smash Ultimate matchup guides with counterplay plans, neutral priorities, punish routes, and between-game adaptation notes for competitive tournament sets.",
  path: "/matchups",
  keywords: [
    "Smash Ultimate matchup guide",
    "Smash Ultimate counterplay",
    "Smash Ultimate matchup guides",
    "Smash Ultimate neutral and punish game",
  ],
});

export default function MatchupsPage() {
  const matchups = sortByDateDesc(getAllMatchups());

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Matchups" }]} />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-50">
        Smash Ultimate Matchup Strategy
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
        Tight, actionable matchup notes: what to respect on reaction, what to
        call out on adaptation, and how to close stocks cleanly in tournament
        pace sets.
      </p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {matchups.map(({ data, content }) => (
          <ArticleCard
            key={data.slug}
            title={data.title}
            description={data.description}
            href={`/matchups/${data.slug}`}
            date={data.date}
            category={data.category}
            difficulty={data.difficulty}
            tags={data.tags}
            readTimeMinutes={readingTimeFromMarkdown(content)}
            microLabel="MATCHUP"
          />
        ))}
      </div>
    </div>
  );
}
