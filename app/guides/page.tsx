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
  const fundamentals = sorted.filter((g) => g.data.category === "Fundamentals");
  const concepts = sorted.filter((g) => g.data.category === "Concepts");
  const characterGuides = sorted.filter(
    (g) =>
      g.data.category === "Character" || g.data.category === "Roster",
  );

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
          mechanics guides
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
          title="Beginner mechanics guides"
          subtitle="Movement, defense, and execution fundamentals that scale from first locals to consistent bracket sets."
        />
        <GuideGrid guides={fundamentals} />
      </section>

      <section className="mt-20" id="concepts">
        <SectionHeading
          title="Competitive Smash concepts"
          subtitle="How neutral is won, how advantage converts to stocks, and how to review VODs with intent."
        />
        <GuideGrid guides={concepts} />
      </section>

      <section className="mt-20" id="characters">
        <SectionHeading
          title="Smash Ultimate character guides"
          subtitle="Starter routes, strengths, weaknesses, and matchup habits for each fighter's gameplan."
        />
        <GuideGrid guides={characterGuides} />
      </section>
    </div>
  );
}
