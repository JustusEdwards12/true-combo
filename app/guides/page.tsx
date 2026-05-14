import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllGuides, sortByDateDesc } from "@/lib/content/load";
import { readingTimeFromMarkdown } from "@/lib/read-time";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Smash Ultimate Guides for Beginners and Competitive Play",
  description:
    "Smash Ultimate guides for beginner fundamentals, neutral, advantage state, disadvantage state, movement, and matchup-ready improvement for real sets.",
  path: "/guides",
  keywords: [
    "Smash Ultimate guides",
    "Smash Ultimate beginner guide",
    "Smash Ultimate fundamentals",
    "Smash Ultimate neutral guide",
    "how to get better at Smash Ultimate",
  ],
});

function GuideGrid({
  guides,
}: {
  guides: ReturnType<typeof getAllGuides>;
}) {
  if (guides.length === 0) {
    return (
      <p className="text-sm text-zinc-500">No guides in this section yet.</p>
    );
  }
  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2">
      {guides.map(({ data, content }) => (
        <ArticleCard
          key={data.slug}
          title={data.title}
          description={data.description}
          href={`/guides/${data.slug}`}
          date={data.date}
          category={data.category}
          difficulty={data.difficulty}
          tags={data.tags}
          readTimeMinutes={readingTimeFromMarkdown(content)}
          microLabel="GUIDE"
        />
      ))}
    </div>
  );
}

function guideMatchesQuery(
  guide: ReturnType<typeof getAllGuides>[number],
  queryTokens: string[],
) {
  const text = [
    guide.data.title,
    guide.data.description,
    guide.data.category ?? "",
    guide.data.difficulty ?? "",
    ...(guide.data.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();
  return queryTokens.every((token) => text.includes(token));
}

type GuidesPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function GuidesPage({ searchParams }: GuidesPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const queryTokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const isSearching = queryTokens.length > 0;
  const sorted = sortByDateDesc(
    getAllGuides().filter((guide) => guide.data.category !== "Matchup"),
  );
  const searchResults = isSearching
    ? sorted.filter((guide) => guideMatchesQuery(guide, queryTokens))
    : [];
  const byCategory = {
    neutral: sorted.filter((g) => g.data.category === "Neutral"),
    advantage: sorted.filter((g) => g.data.category === "Advantage"),
    defenseDisadvantage: sorted.filter(
      (g) => g.data.category === "Defense" || g.data.category === "Disadvantage",
    ),
    movement: sorted.filter((g) => g.data.category === "Movement"),
    trainingMindset: sorted.filter(
      (g) =>
        g.data.category === "Training" ||
        g.data.category === "Mindset" ||
        g.data.category === "Systems",
    ),
    characterRoster: sorted.filter(
      (g) => g.data.category === "Character" || g.data.category === "Roster",
    ),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-50">
        Smash Ultimate Guides
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
        Practical Super Smash Bros. Ultimate write-ups you can lab tonight:
        beginner mechanics, character improvement, and matchup-aware habits for
        competitive play.
      </p>

      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-zinc-500">
        Build your path with{" "}
        <a
          href="#beginner"
          className="text-cyan-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
        >
          neutral and fundamentals
        </a>
        , then connect it to{" "}
        <a
          href="#characters"
          className="text-cyan-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
        >
          character guides
        </a>
        , and{" "}
        <Link
          href="/matchups"
          className="text-cyan-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
        >
          matchup strategy
        </Link>
        .
      </p>

      {isSearching ? (
        <section className="mt-16">
          <SectionHeading
            title={`Search results: "${query}"`}
            subtitle="Filtered guides matching your search terms."
          />
          <GuideGrid guides={searchResults} />
          <p className="mt-6 text-sm text-zinc-500">
            Looking for the full archive?{" "}
            <Link
              href="/guides"
              className="text-cyan-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
            >
              Clear search
            </Link>
            .
          </p>
        </section>
      ) : (
        <>
          <section className="mt-16" id="beginner">
            <SectionHeading
              title="Neutral and positioning"
              subtitle="Spacing, stage control, and whiff-punish fundamentals that shape every interaction."
            />
            <GuideGrid guides={byCategory.neutral} />
          </section>

          <section className="mt-20" id="concepts">
            <SectionHeading
              title="Advantage and pressure"
              subtitle="Ledge traps, juggling, and pressure flow that turn openings into stocks."
            />
            <GuideGrid guides={byCategory.advantage} />
          </section>

          <section className="mt-20">
            <SectionHeading
              title="Defense and disadvantage"
              subtitle="Shield responses, recovery choices, and corner escapes to survive pressure and reset neutral."
            />
            <GuideGrid guides={byCategory.defenseDisadvantage} />
          </section>

          <section className="mt-20">
            <SectionHeading
              title="Movement and execution"
              subtitle="Short hops, fast falls, and execution consistency that make your options reliable under pressure."
            />
            <GuideGrid guides={byCategory.movement} />
          </section>

          <section className="mt-20">
            <SectionHeading
              title="Training, mindset, and systems"
              subtitle="Practice structure, adaptation habits, and rank-system context for long-term improvement."
            />
            <GuideGrid guides={byCategory.trainingMindset} />
          </section>

          <section className="mt-20" id="characters">
            <SectionHeading
              title="Smash Ultimate character guides"
              subtitle="Starter routes, strengths, weaknesses, and matchup habits for each fighter's gameplan."
            />
            <GuideGrid guides={byCategory.characterRoster} />
          </section>
        </>
      )}
    </div>
  );
}
