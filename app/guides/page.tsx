import { ArticleCard } from "@/components/ArticleCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllGuides, sortByDateDesc } from "@/lib/content/load";
import { readingTimeFromMarkdown } from "@/lib/read-time";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Guides",
  description:
    "Smash Ultimate guides covering movement, neutral, tech skill, and character fundamentals.",
  path: "/guides",
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
  const fundamentals = sorted.filter((g) => g.data.category === "Fundamentals");
  const concepts = sorted.filter((g) => g.data.category === "Concepts");
  const characterGuides = sorted.filter((g) => g.data.category === "Character");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-50">
        Guides
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
        Practical write-ups you can lab tonight—clear goals, clean routes, and
        matchup-aware habits.
      </p>

      <section className="mt-16" id="beginner">
        <SectionHeading
          title="Beginner guides"
          subtitle="Movement, defense, and execution basics that scale with you."
        />
        <GuideGrid guides={fundamentals} />
      </section>

      <section className="mt-20" id="concepts">
        <SectionHeading
          title="Competitive concepts"
          subtitle="How advantage works, how neutral is won, and how to review VODs."
        />
        <GuideGrid guides={concepts} />
      </section>

      <section className="mt-20" id="characters">
        <SectionHeading
          title="Character guides"
          subtitle="Starter routes and honest notes on strengths, weaknesses, and common mistakes."
        />
        <GuideGrid guides={characterGuides} />
      </section>
    </div>
  );
}
