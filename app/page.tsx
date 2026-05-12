import type { CSSProperties } from "react";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { CharacterCard } from "@/components/CharacterCard";
import { HomeAtmosphere } from "@/components/home/HomeAtmosphere";
import { HubLinkCard } from "@/components/home/HubLinkCard";
import { SectionHeading } from "@/components/SectionHeading";
import {
  getAllCharacters,
  getAllGuides,
  getAllMatchups,
  sortByDateDesc,
} from "@/lib/content/load";
import { readingTimeFromMarkdown } from "@/lib/read-time";
import { buildMetadata } from "@/lib/seo";

const hubLanes = [
  {
    index: "01",
    title: "Beginner Mechanics Guides",
    description:
      "Short hops, teching, and defensive defaults for Smash Ultimate players building tournament fundamentals.",
    href: "/guides#beginner",
    phase: "neutral" as const,
    framesLabel: "LANE · MECH",
  },
  {
    index: "02",
    title: "Smash Ultimate Character Guides",
    description:
      "Honest kits, starter routes, and the mistakes that cost stocks in bracket.",
    href: "/characters",
    phase: "advantage" as const,
    framesLabel: "ROSTER · DATA",
  },
  {
    index: "03",
    title: "Smash Ultimate Matchup Strategy",
    description:
      "Respect windows, punish plans, and adaptation habits for real set play.",
    href: "/matchups",
    phase: "punish" as const,
    framesLabel: "SET · LOG",
  },
  {
    index: "04",
    title: "Competitive Smash Concepts",
    description:
      "Neutral framing, advantage cycles, and VOD review frameworks that turn theory into cleaner decisions.",
    href: "/guides#concepts",
    phase: "confirm" as const,
    framesLabel: "META · READ",
  },
];

const resourceChips = [
  { label: "Beginner Mechanics Guides", href: "/guides#beginner" },
  { label: "Smash Ultimate Character Guides", href: "/characters" },
  { label: "Matchup Strategy", href: "/matchups" },
  { label: "Competitive Smash Concepts", href: "/guides#concepts" },
] as const;

const learningPathways = [
  {
    label: "Neutral",
    subtopics: "Spacing • Baiting • Stage Control",
    href: "/guides#concepts",
    accent: "text-cyan-200/95",
  },
  {
    label: "Advantage",
    subtopics: "Juggling • Pressure • Ledgetrapping",
    href: "/guides#concepts",
    accent: "text-cyan-300/95",
  },
  {
    label: "Disadvantage",
    subtopics: "DI • Escaping • Recovery",
    href: "/guides#concepts",
    accent: "text-violet-200/95",
  },
  {
    label: "Matchup Theory",
    subtopics: "Adaptation • Habits • Punishes",
    href: "/matchups",
    accent: "text-amber-200/90",
  },
  {
    label: "Mental Stack",
    subtopics: "Awareness • Priority • Decision Speed",
    href: "/guides#concepts",
    accent: "text-cyan-200/90",
  },
  {
    label: "Conditioning",
    subtopics: "Timing • Threats • Pattern Breaks",
    href: "/guides#concepts",
    accent: "text-cyan-300/90",
  },
] as const;

function sectionRevealStyle(ms: number): CSSProperties {
  return { "--tc-reveal-delay": `${ms}ms` } as CSSProperties;
}

export const metadata = buildMetadata({
  title: "Smash Ultimate Guides, Character Guides, and Matchup Strategy",
  description:
    "TrueCombo is a competitive Super Smash Bros. Ultimate improvement hub with beginner mechanics guides, character guides, matchup strategy, and concept training for tournament play.",
  path: "/",
  keywords: [
    "Smash Ultimate guides",
    "Smash Ultimate beginner guide",
    "Smash Ultimate character guides",
    "Smash Ultimate matchup strategy",
    "competitive Smash mechanics",
  ],
});

export default function HomePage() {
  const sortedGuides = sortByDateDesc(getAllGuides());

  const featuredBeginner = sortByDateDesc(
    sortedGuides.filter((g) => g.data.category === "Fundamentals"),
  ).slice(0, 4);
  const featuredGuides = sortedGuides.slice(0, 3);
  const latestGuides = sortedGuides.slice(3, 12);
  const conceptGuides = sortedGuides.filter(
    (g) => g.data.category === "Concepts",
  );
  const characters = sortByDateDesc(getAllCharacters()).slice(0, 5);
  const matchups = sortByDateDesc(getAllMatchups()).slice(0, 3);

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden">
      <HomeAtmosphere />

      <section
        className="relative border-b border-zinc-800/60"
        aria-labelledby="hero-heading"
      >
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-12">
            <div className="tc-home-section" style={sectionRevealStyle(0)}>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.32em] text-cyan-500/85">
                Super Smash Bros. Ultimate · Knowledge hub
              </p>
              <h1
                id="hero-heading"
                className="mt-5 max-w-[22ch] text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl sm:leading-[1.12] lg:text-[2.65rem] lg:leading-[1.1]"
              >
                Get better at Smash Ultimate, one true combo at a time.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                Serious Super Smash Bros. Ultimate guides for beginner
                improvement, character mastery, matchup strategy, and
                competitive mechanics, built like an esports desk and written
                for
                bracket night.
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

            <aside
              className="tc-home-section relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] backdrop-blur-sm sm:p-8"
              style={sectionRevealStyle(60)}
              aria-label="Competitive learning pathways"
            >
              <div className="pointer-events-none absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
              <div className="pointer-events-none absolute inset-x-6 top-[4.5rem] h-px bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent" />
              <div className="pointer-events-none absolute bottom-10 left-1/2 h-20 w-40 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-2xl" />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                    Competitive learning pathways
                  </p>
                  <h2 className="mt-3 max-w-[20ch] text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
                    Build tournament-ready decision making.
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
                    Choose a concept lane and train the same high-leverage
                    situations that decide real sets.
                  </p>
                </div>
                <div className="mt-1 flex shrink-0 gap-1.5" aria-hidden>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-2.5 w-2.5 rounded-full border border-cyan-300/40 bg-cyan-400/20 shadow-[0_0_16px_rgba(34,211,238,0.18)]"
                    />
                  ))}
                </div>
              </div>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {learningPathways.map((path) => (
                  <li key={path.label}>
                    <Link
                      href={path.href}
                      className="group relative block overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-3 transition-[transform,border-color,background-color,box-shadow] duration-300 motion-safe:hover:-translate-y-0.5 hover:border-cyan-500/35 hover:bg-cyan-500/[0.07] hover:shadow-[0_14px_36px_-22px_rgba(34,211,238,0.55)]"
                    >
                      <span className="pointer-events-none absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-cyan-400/70 to-transparent opacity-60 transition-opacity group-hover:opacity-100" />
                      <p
                        className={`font-mono text-[10px] uppercase tracking-[0.18em] ${path.accent}`}
                      >
                        {path.label}
                      </p>
                      <p className="mt-2 text-[11px] leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-300">
                        {path.subtopics}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-7 border-t border-zinc-800/80 pt-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                  Tactical focus flow
                </p>
                <div className="mt-3 grid grid-cols-5 items-center gap-2" aria-hidden>
                  {[26, 44, 34, 54, 38].map((h, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-gradient-to-r from-cyan-500/35 to-cyan-300/70 transition-opacity duration-300 hover:opacity-100"
                      style={{ height: `${h / 2}px` }}
                    />
                  ))}
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">
                  Start with neutral control, then layer pressure, adaptation,
                  and confirms as your reads tighten.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section
        className="border-b border-zinc-800/60 py-12 sm:py-16"
        aria-labelledby="training-lanes-heading"
      >
        <div
          className="tc-home-section mx-auto max-w-6xl px-4 sm:px-6"
          style={sectionRevealStyle(100)}
        >
          <SectionHeading
            id="training-lanes-heading"
            kicker="Coverage map"
              title="Smash Ultimate learning pathways"
              subtitle="Pick a lane like you pick a stage: mechanics, characters, matchups, and concepts built for competitive improvement."
          />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {hubLanes.map((lane) => (
              <HubLinkCard key={lane.href} {...lane} />
            ))}
          </ul>
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
              kicker="Fundamentals"
              title="Beginner mechanics guides"
              subtitle="Execution, defense, and movement drills that turn early Smash Ultimate practice into consistent match wins."
            />
            <Link
              href="/guides#beginner"
              className="text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
            >
              All fundamentals →
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
                name={data.title}
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
