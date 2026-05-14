import type { CSSProperties } from "react";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { CharacterCard } from "@/components/CharacterCard";
import { HomeAtmosphere } from "@/components/home/HomeAtmosphere";
import { ImprovementPathGraphic } from "@/components/home/ImprovementPathGraphic";
import { LaneVisualCard } from "@/components/home/LaneVisualCard";
import { RotatingHeadlineWord } from "@/components/home/RotatingHeadlineWord";
import { SectionHeading } from "@/components/SectionHeading";
import {
  buildCharacterGuideDisplayTitle,
  getCharacterNameFromTitle,
} from "@/lib/character-title";
import {
  getAllCharacters,
  getAllGlossaryTerms,
  getAllGuides,
  getAllMatchups,
  sortByDateDesc,
} from "@/lib/content/load";
import { readingTimeFromMarkdown } from "@/lib/read-time";
import { buildMetadata } from "@/lib/seo";

const resourceChips = [
  { label: "Beginner Mechanics Guides", href: "/guides#beginner" },
  { label: "Smash Ultimate Character Guides", href: "/characters" },
  { label: "Matchup Strategy", href: "/matchups" },
  { label: "Competitive Smash Concepts", href: "/guides#concepts" },
] as const;

const laneVisuals = [
  {
    title: "Guides",
    description: "Build core mechanics, spacing, and decision-making that transfer directly to real games.",
    href: "/guides",
    variant: "guides" as const,
    statType: "guides" as const,
  },
  {
    title: "Characters",
    description: "Learn each fighter’s strengths, win conditions, and practical gameplan structure.",
    href: "/characters",
    variant: "characters" as const,
    statType: "characters" as const,
  },
  {
    title: "Matchups",
    description: "Study matchup-specific options, counterplay routes, and adaptation priorities.",
    href: "/matchups",
    variant: "matchups" as const,
    statType: "matchups" as const,
  },
  {
    title: "Glossary",
    description: "Learn terms used in guides and throughout the Smash community.",
    href: "/glossary",
    variant: "glossary" as const,
    statType: "glossary" as const,
  },
] as const;

function sectionRevealStyle(ms: number): CSSProperties {
  return { "--tc-reveal-delay": `${ms}ms` } as CSSProperties;
}

export const metadata = buildMetadata({
  title: "Smash Ultimate Guides, Character Guides, and Matchup Guides",
  description:
    "TrueCombo is a competitive Super Smash Bros. Ultimate improvement hub with beginner fundamentals guides, character guides, matchup guides, and glossary-backed training.",
  path: "/",
  keywords: [
    "Smash Ultimate guides",
    "Smash Ultimate beginner guide",
    "Smash Ultimate character guides",
    "Smash Ultimate matchup guide",
    "Smash Ultimate fundamentals",
  ],
});

export default function HomePage() {
  const sortedGuides = sortByDateDesc(getAllGuides());
  const allCharacters = getAllCharacters();
  const allMatchups = getAllMatchups();
  const allGlossaryTerms = getAllGlossaryTerms();

  const featuredBeginner = sortByDateDesc(
    sortedGuides.filter((g) =>
      [
        "Movement",
        "Defense",
        "Disadvantage",
        "Neutral",
        "Training",
      ].includes(g.data.category ?? ""),
    ),
  ).slice(0, 4);
  const featuredGuides = sortedGuides.slice(0, 3);
  const latestGuides = sortedGuides.slice(3, 12);
  const conceptGuides = sortedGuides.filter(
    (g) =>
      ["Neutral", "Advantage", "Mindset", "Systems"].includes(
        g.data.category ?? "",
      ),
  );
  const characters = sortByDateDesc(allCharacters).slice(0, 5);
  const matchups = sortByDateDesc(allMatchups).slice(0, 3);

  const pathwayStats = {
    guides: `${sortedGuides.length} Lessons`,
    characters: `${allCharacters.length} Fighters`,
    matchups: `${allMatchups.length} Matchups`,
    glossary: `${allGlossaryTerms.length} Terms`,
  } as const;

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden">
      <section
        className="relative border-b border-zinc-800/60"
        aria-labelledby="hero-heading"
      >
        <HomeAtmosphere />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="tc-home-section" style={sectionRevealStyle(0)}>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.32em] text-cyan-500/85">
              Super Smash Bros. Ultimate · Knowledge hub
            </p>
            <h1
              id="hero-heading"
              className="mt-5 max-w-[22ch] text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl sm:leading-[1.12] lg:text-[2.65rem] lg:leading-[1.1]"
            >
              Get better at Smash Ultimate, one{" "}
              <RotatingHeadlineWord
                words={[
                  "true combo",
                  "hard read",
                  "edgeguard",
                  "adaptation",
                  "clean punish",
                  "ledgetrap",
                ]}
                typingMs={104}
                deletingMs={62}
                holdMs={1950}
              />{" "}
              at a time.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              Serious Super Smash Bros. Ultimate guides for beginner
              improvement, character mastery, matchup strategy, and competitive
              mechanics, built like an esports desk and written for bracket
              night.
            </p>

            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Topics">
              {resourceChips.map((chip) => (
                <li key={chip.href + chip.label}>
                  <Link
                    href={chip.href}
                    className="inline-flex items-center rounded-full border border-zinc-700/80 bg-zinc-950/50 px-3.5 py-1.5 text-xs font-medium text-zinc-300 shadow-[0_0_0_1px_rgba(0,0,0,0.4)_inset] transition-[transform,border-color,background-color,box-shadow] duration-300 motion-safe:hover:-translate-y-0.5 hover:border-cyan-500/35 hover:bg-cyan-500/5 hover:shadow-[0_0_24px_-8px_rgba(34,211,238,0.35)]"
                  >
                    {chip.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/guides"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-7 text-sm font-semibold text-zinc-950 shadow-[0_16px_40px_-18px_rgba(34,211,238,0.55)] transition-[transform,filter] duration-300 motion-safe:hover:-translate-y-0.5 hover:brightness-105"
              >
                Start Smash Ultimate Guides
              </Link>
              <Link
                href="/characters"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-700/90 bg-zinc-950/40 px-7 text-sm font-semibold text-zinc-100 transition-[transform,border-color,background-color] duration-300 motion-safe:hover:-translate-y-0.5 hover:border-zinc-500/80 hover:bg-zinc-900/50"
              >
                Browse Characters
              </Link>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent via-zinc-950/45 to-zinc-950/85" />
      </section>

      <section
        className="relative border-b border-zinc-800/60 py-12 sm:py-16"
        aria-labelledby="training-lanes-heading"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-zinc-950/70 to-transparent" />
        <div
          className="tc-home-section mx-auto max-w-[68rem] px-5 sm:px-8"
          style={sectionRevealStyle(100)}
        >
          <div className="relative">
            <div className="pointer-events-none absolute -left-10 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-cyan-500/9 blur-3xl" />
            <div className="pointer-events-none absolute -right-12 top-1/2 h-38 w-38 -translate-y-1/2 rounded-full bg-blue-500/8 blur-3xl" />
            <div className="pointer-events-none absolute right-4 bottom-0 h-28 w-28 rounded-full bg-amber-400/6 blur-3xl" />
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                id="training-lanes-heading"
                kicker="Core progression"
                title="Smash Ultimate Learning Pathways"
                subtitle="Pick one focused lane and build match-ready skill with clear progression."
              />
              <span className="rounded-full border border-zinc-700/80 bg-zinc-900/55 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                4 pathways
              </span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {laneVisuals.map((lane) => (
                <LaneVisualCard
                  key={lane.title}
                  title={lane.title}
                  description={lane.description}
                  href={lane.href}
                  variant={lane.variant}
                  stat={pathwayStats[lane.statType]}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-b border-zinc-800/60 py-12 sm:py-16"
        aria-labelledby="featured-beginner-heading"
      >
        <div
          className="tc-home-section mx-auto max-w-6xl px-4 sm:px-6"
          style={sectionRevealStyle(110)}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              id="featured-beginner-heading"
              kicker="Core Skills"
              title="Beginner mechanics guides"
              subtitle="Execution, defense, and movement drills that turn early Smash Ultimate practice into consistent match wins."
            />
            <Link
              href="/guides#beginner"
              className="text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
            >
              All beginner guides →
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredBeginner.map(({ data, content }) => (
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
        </div>
      </section>

      <section
        className="border-b border-zinc-800/60 py-12 sm:py-16"
        aria-labelledby="featured-guides-heading"
      >
        <div
          className="tc-home-section mx-auto max-w-6xl px-4 sm:px-6"
          style={sectionRevealStyle(120)}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              id="featured-guides-heading"
              kicker="Editorial picks"
              title="Featured Smash Ultimate guides"
              subtitle="High-signal reads before your next local: mechanics, competitive concepts, and practical improvement frameworks."
            />
            <Link
              href="/guides"
              className="text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
            >
              View archive →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featuredGuides.map(({ data, content }) => (
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
                variant="featured"
                microLabel="GUIDE"
              />
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-b border-zinc-800/60 py-12 sm:py-16"
        aria-labelledby="character-guides-heading"
      >
        <div
          className="tc-home-section mx-auto max-w-6xl px-4 sm:px-6"
          style={sectionRevealStyle(140)}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              id="character-guides-heading"
              kicker="Roster lab"
              title="Smash Ultimate character guides"
              subtitle="Character gameplans, core confirms, and matchup-aware habits that separate pools exits from bracket runs."
            />
            <Link
              href="/characters"
              className="text-sm font-semibold text-violet-300/90 transition-colors hover:text-violet-200"
            >
              Full roster →
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {characters.map(({ data }) => (
              <CharacterCard
                key={data.slug}
                name={buildCharacterGuideDisplayTitle(
                  getCharacterNameFromTitle(data.title),
                )}
                description={data.description}
                slug={data.slug}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-b border-zinc-800/60 py-12 sm:py-16"
        aria-labelledby="matchup-analysis-heading"
      >
        <div
          className="tc-home-section mx-auto max-w-6xl px-4 sm:px-6"
          style={sectionRevealStyle(160)}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              id="matchup-analysis-heading"
              kicker="Bracket science"
              title="Smash Ultimate matchup strategy"
              subtitle="Set logic you can rehearse: what to respect on reaction, what to punish on adaptation, and how to close stocks."
            />
            <Link
              href="/matchups"
              className="text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
            >
              All matchups →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </section>

      <section
        className="border-b border-zinc-800/60 py-12 sm:py-16"
        aria-labelledby="competitive-concepts-heading"
      >
        <div
          className="tc-home-section mx-auto max-w-6xl px-4 sm:px-6"
          style={sectionRevealStyle(180)}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              id="competitive-concepts-heading"
              kicker="Theorycraft"
              title="Competitive Smash concepts"
              subtitle="Neutral, advantage state, disadvantage, and VOD review language that turns theory into better in-game decisions."
            />
            <Link
              href="/guides#concepts"
              className="text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
            >
              Jump to section →
            </Link>
          </div>
          <div className="mt-8 max-w-4xl">
            <ImprovementPathGraphic />
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {conceptGuides.length === 0 ? (
              <p className="text-sm text-zinc-500">
                Concept guides are on the way—browse all guides for now.
              </p>
            ) : (
              conceptGuides.map(({ data, content }) => (
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
                  microLabel="CONCEPT"
                />
              ))
            )}
          </div>
        </div>
      </section>

      <section
        className="py-12 sm:py-20"
        aria-labelledby="latest-articles-heading"
      >
        <div
          className="tc-home-section mx-auto max-w-6xl px-4 sm:px-6"
          style={sectionRevealStyle(200)}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              id="latest-articles-heading"
              kicker="Feed"
              title="Latest Smash Ultimate guides"
              subtitle="New and updated guides across mechanics, characters, and matchup strategy."
            />
            <Link
              href="/guides"
              className="text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
            >
              Open feed →
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestGuides.length === 0 ? (
              <p className="col-span-full text-sm text-zinc-500">
                You’re caught up—check featured guides above.
              </p>
            ) : (
              latestGuides.map(({ data, content }) => (
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
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
