import { CharacterCard } from "@/components/CharacterCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  buildCharacterGuideDisplayTitle,
  getCharacterNameFromTitle,
} from "@/lib/character-title";
import { getAllCharacters, sortByDateDesc } from "@/lib/content/load";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Smash Ultimate Character Guides and Gameplans",
  description:
    "Smash Ultimate character guides with matchup-aware gameplans, key moves, frame-data priorities, and beginner-friendly checklists for steady improvement.",
  path: "/characters",
  keywords: [
    "Smash Ultimate character guides",
    "Smash Ultimate character gameplan",
    "Smash Ultimate frame data guide",
    "best beginner Smash Ultimate characters",
  ],
});

export default function CharactersPage() {
  const chars = sortByDateDesc(getAllCharacters());

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Characters" }]}
      />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-50">
        Smash Ultimate Character Guides
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
        Pick a fighter for focused notes on neutral, advantage, and
        disadvantage-what to lean on early, what to respect in bracket, and
        where players commonly leak percent.
      </p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {chars.map(({ data }) => (
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
  );
}
