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

const hubLanes = [
  {
    index: "01",
    title: "Beginner Mechanics",
    description:
      "Short hops, teching, and defensive defaults—mechanics that hold up offline.",
    href: "/guides#beginner",
    phase: "neutral" as const,
    framesLabel: "LANE · MECH",
  },
  {
    index: "02",
    title: "Character Guides",
    description:
      "Honest kits, starter routes, and the mistakes that cost stocks in bracket.",
    href: "/characters",
    phase: "advantage" as const,
    framesLabel: "ROSTER · DATA",
  },
  {
    index: "03",
    title: "Matchup Theory",
    description:
      "Respect windows, punish plans, and how to stay composed on stream.",
    href: "/matchups",
    phase: "punish" as const,
    framesLabel: "SET · LOG",
  },
  {
    index: "04",
    title: "Competitive Concepts",
    description:
      "Neutral framing, advantage cycles, and how to review without cope.",
    href: "/guides#concepts",
    phase: "confirm" as const,
    framesLabel: "META · READ",
  },
];

const resourceChips = [
  { label: "Beginner Mechanics", href: "/guides#beginner" },
  { label: "Character Guides", href: "/characters" },
  { label: "Matchup Theory", href: "/matchups" },
  { label: "Competitive Concepts", href: "/guides#concepts" },
] as const;

function sectionRevealStyle(ms: number): CSSProperties {
  return { "--tc-reveal-delay": `${ms}ms` } as CSSProperties;
}

export default function HomePage() {
  const sortedGuides = sortByDateDesc(getAllGuides());
  const totalLibraryMinutes = sortedGuides.reduce(
    (acc, doc) => acc + readingTimeFromMarkdown(doc.content),
    0,
  );

  const featuredGuides = sortedGuides.slice(0, 3);
  const latestGuides = sortedGuides.slice(3, 9);
  const conceptGuides = sortedGuides.filter(
    (g) => g.data.category === "Concepts",
  );
  const characters = sortByDateDesc(getAllCharacters()).slice(0, 4);
  const matchups = sortByDateDesc(getAllMatchups()).slice(0, 3);

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden">
      <HomeAtmosphere />

      <section
        className="relative border-b border-zinc-800/60"
        aria-labelledby="hero-heading"
      >
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-16">
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
                Character guides, matchup analysis, mechanics breakdowns, and
                competitive improvement resources—built like an esports desk,
                written for bracket night.
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
                  Start Learning
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
              aria-label="Coverage snapshot"
            >
              <div className="pointer-events-none absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    Live resource depth
                  </p>
                  <p className="mt-2 font-mono text-3xl font-semibold tabular-nums tracking-tight text-zinc-100">
                    {totalLibraryMinutes}
                    <span className="ml-2 align-top text-sm font-medium text-cyan-400/90">
                      min
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Editorial minutes across published guides—expandable every
                    patch cycle.
                  </p>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                    KO threat meter ·{" "}
                    <span className="text-amber-200/80">142.6%</span>{" "}
                    <span className="text-zinc-600">(display)</span>
                  </p>
                </div>
                <div className="flex shrink-0 gap-1 pt-1" aria-hidden>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-6 w-5 rounded-sm border border-zinc-600 bg-gradient-to-b from-zinc-700/80 to-zinc-900 shadow-[0_0_0_1px_rgba(0,0,0,0.5)]"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-8 space-y-3 font-mono text-[10px] uppercase tracking-[0.18em]">
                <div className="flex items-center justify-between rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-3 py-2">
                  <span className="text-amber-200/85">Neutral</span>
                  <span className="tabular-nums text-zinc-500">FOCUS · MID</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-cyan-500/15 bg-cyan-500/5 px-3 py-2">
                  <span className="text-cyan-200/90">Advantage</span>
                  <span className="tabular-nums text-cyan-500/60">PRESS · OKI</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-3 py-2">
                  <span className="text-rose-200/80">Disadvantage</span>
                  <span className="tabular-nums text-zinc-500">ESCAPE · DI</span>
                </div>
              </div>

              <div className="mt-8 border-t border-zinc-800/80 pt-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                  Combo visualization
                </p>
                <div
                  className="mt-3 flex items-end gap-1"
                  aria-hidden
                >
                  {[40, 72, 55, 90, 48].map((h, i) => (
                    <span
                      key={i}
                      className="w-2 rounded-t-sm bg-gradient-to-t from-cyan-600/50 to-cyan-300/80 opacity-80 transition-opacity hover:opacity-100"
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">
                  Bars read as relative commitment—longer isn’t “better,” it’s
                  more conditioning before the kill confirm.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section
        className="border-b border-zinc-800/60 py-16 sm:py-20"
        aria-labelledby="training-lanes-heading"
      >
        <div
          className="tc-home-section mx-auto max-w-6xl px-4 sm:px-6"
          style={sectionRevealStyle(100)}
        >
          <SectionHeading
            id="training-lanes-heading"
            kicker="Coverage map"
            title="Training lanes"
            subtitle="Pick a lane like you’d pick a stage—know the win condition, respect the counterpick."
          />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {hubLanes.map((lane) => (
              <HubLinkCard key={lane.href} {...lane} />
            ))}
          </ul>
        </div>
      </section>

      <section
        className="border-b border-zinc-800/60 py-16 sm:py-20"
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
              title="Featured guides"
              subtitle="High-signal articles to read before your next local—mechanics, concepts, and honest character notes."
            />
            <Link
              href="/guides"
              className="text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
            >
              View archive →
            </Link>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
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
        className="border-b border-zinc-800/60 py-16 sm:py-20"
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
              title="Character guides"
              subtitle="Loadouts, gameplans, and the habits that separate pools from top 8."
            />
            <Link
              href="/characters"
              className="text-sm font-semibold text-violet-300/90 transition-colors hover:text-violet-200"
            >
              Full roster →
            </Link>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
        className="border-b border-zinc-800/60 py-16 sm:py-20"
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
              title="Matchup analysis"
              subtitle="Set logic you can rehearse—respect on reaction, punish on conditioning."
            />
            <Link
              href="/matchups"
              className="text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
            >
              All matchups →
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        className="border-b border-zinc-800/60 py-16 sm:py-20"
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
              title="Competitive concepts"
              subtitle="VOD review, neutral language, and how to think in advantage cycles—not vibes."
            />
            <Link
              href="/guides#concepts"
              className="text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
            >
              Jump to section →
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
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
        className="py-16 sm:py-24"
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
              title="Latest articles"
              subtitle="Fresh drops and refreshed routes—new guides land here first."
            />
            <Link
              href="/guides"
              className="text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
            >
              Open feed →
            </Link>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
