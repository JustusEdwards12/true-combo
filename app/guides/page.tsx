import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllGuides, sortByDateDesc } from "@/lib/content/load";
import { readingTimeFromMarkdown } from "@/lib/read-time";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Smash Ultimate Guides",
  description:
    "Smash Ultimate guides for beginner mechanics, competitive concepts, character improvement, and matchup-ready habits.",
  path: "/guides",
  keywords: [
    "Smash Ultimate guides",
    "Smash Ultimate beginner mechanics",
    "Smash Ultimate neutral guide",
    "competitive Smash Ultimate tips",
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

export default function GuidesPage() {
  const sorted = sortByDateDesc(getAllGuides());
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
    matchup: sorted.filter((g) => g.data.category === "Matchup"),
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
        <a href="#beginner" className="text-cyan-400 hover:underline">
          neutral and fundamentals
        </a>
        , then connect it to{" "}
        <a href="#characters" className="text-cyan-400 hover:underline">
          character guides
        </a>
        , and{" "}
        <Link href="/matchups" className="text-cyan-400 hover:underline">
          matchup strategy
        </Link>
        .
      </p>

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

      <section className="mt-20">
        <SectionHeading
          title="Matchup preparation"
          subtitle="Counterplay plans and matchup-specific priorities you can bring straight into set play."
        />
        <GuideGrid guides={byCategory.matchup} />
      </section>

      <section className="mt-20" id="characters">
        <SectionHeading
          title="Smash Ultimate character guides"
          subtitle="Starter routes, strengths, weaknesses, and matchup habits for each fighter's gameplan."
        />
        <GuideGrid guides={byCategory.characterRoster} />
      </section>
    </div>
  );
}
