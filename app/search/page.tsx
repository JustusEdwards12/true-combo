import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CharacterCard } from "@/components/CharacterCard";
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

export const metadata = buildMetadata({
  title: "Search TrueCombo Content",
  description:
    "Search guides, character pages, matchups, and glossary terms across TrueCombo.",
  path: "/search",
  noIndex: true,
});

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function tokenize(value: string) {
  return normalize(value).split(/\s+/).filter(Boolean);
}

function includesAllTokens(text: string, tokens: string[]) {
  const normalizedText = normalize(text);
  return tokens.every((token) => normalizedText.includes(token));
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const tokens = tokenize(query);
  const searching = tokens.length > 0;

  const guides = sortByDateDesc(
    getAllGuides().filter((guide) => guide.data.category !== "Matchup"),
  );
  const characters = sortByDateDesc(getAllCharacters());
  const matchups = sortByDateDesc(getAllMatchups());
  const glossary = [...getAllGlossaryTerms()].sort((a, b) =>
    a.data.title.localeCompare(b.data.title),
  );

  const guideResults = searching
    ? guides.filter((guide) =>
        includesAllTokens(
          [
            guide.data.title,
            guide.data.description,
            guide.data.category ?? "",
            guide.data.difficulty ?? "",
            ...(guide.data.tags ?? []),
          ].join(" "),
          tokens,
        ),
      )
    : [];

  const characterResults = searching
    ? characters.filter((character) =>
        includesAllTokens(
          [
            character.data.title,
            character.data.description,
            character.data.category ?? "",
            character.data.difficulty ?? "",
            ...(character.data.tags ?? []),
          ].join(" "),
          tokens,
        ),
      )
    : [];

  const matchupResults = searching
    ? matchups.filter((matchup) =>
        includesAllTokens(
          [
            matchup.data.title,
            matchup.data.description,
            matchup.data.category ?? "",
            matchup.data.difficulty ?? "",
            ...(matchup.data.tags ?? []),
          ].join(" "),
          tokens,
        ),
      )
    : [];

  const glossaryResults = searching
    ? glossary.filter((term) =>
        includesAllTokens(
          [
            term.data.title,
            term.data.description,
            term.data.category ?? "",
            ...(term.data.tags ?? []),
          ].join(" "),
          tokens,
        ),
      )
    : [];

  const totalResults =
    guideResults.length +
    characterResults.length +
    matchupResults.length +
    glossaryResults.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-50">
        Search TrueCombo
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
        Search guides, characters, matchups, and glossary terms from one place.
      </p>

      {!searching ? (
        <div className="mt-8 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm text-zinc-400">
          Enter a search in the header to see matching content.
        </div>
      ) : (
        <>
          <p className="mt-8 text-sm text-zinc-500">
            Found <span className="text-zinc-300">{totalResults}</span> results for{" "}
            <span className="text-cyan-300">&quot;{query}&quot;</span>.
          </p>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-zinc-100">
              Guides ({guideResults.length})
            </h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {guideResults.map(({ data, content }) => (
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
          </section>

          <section className="mt-12">
            <h2 className="text-lg font-semibold text-zinc-100">
              Characters ({characterResults.length})
            </h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {characterResults.map(({ data }) => (
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
          </section>

          <section className="mt-12">
            <h2 className="text-lg font-semibold text-zinc-100">
              Matchups ({matchupResults.length})
            </h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {matchupResults.map(({ data, content }) => (
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
          </section>

          <section className="mt-12">
            <h2 className="text-lg font-semibold text-zinc-100">
              Glossary ({glossaryResults.length})
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {glossaryResults.map(({ data }) => (
                <Link
                  key={data.slug}
                  href={`/glossary/${data.slug}`}
                  className="rounded-xl border border-zinc-800/80 bg-zinc-900/35 px-4 py-3 transition-colors hover:border-cyan-500/35 hover:bg-cyan-500/[0.06]"
                >
                  <p className="text-sm font-semibold text-zinc-100">{data.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                    {data.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
