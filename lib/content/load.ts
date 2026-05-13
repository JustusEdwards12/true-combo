import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  CharacterFrontmatter,
  GlossaryFrontmatter,
  GuideFrontmatter,
  MatchupFrontmatter,
  ParsedDoc,
} from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function readDirSafe(sub: string): string[] {
  const dir = path.join(CONTENT_ROOT, sub);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
}

function parseFile<T>(filePath: string): ParsedDoc<T> {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { data: data as T, content };
}

export function getAllGuides(): ParsedDoc<GuideFrontmatter>[] {
  return readDirSafe("guides").map((f) =>
    parseFile<GuideFrontmatter>(path.join(CONTENT_ROOT, "guides", f)),
  );
}

export function getGuideBySlug(
  slug: string,
): ParsedDoc<GuideFrontmatter> | null {
  const guides = getAllGuides();
  return guides.find((g) => g.data.slug === slug) ?? null;
}

export function getAllCharacters(): ParsedDoc<CharacterFrontmatter>[] {
  return readDirSafe("characters").map((f) =>
    parseFile<CharacterFrontmatter>(path.join(CONTENT_ROOT, "characters", f)),
  );
}

export function getCharacterBySlug(
  slug: string,
): ParsedDoc<CharacterFrontmatter> | null {
  const chars = getAllCharacters();
  return chars.find((c) => c.data.slug === slug) ?? null;
}

export function getAllMatchups(): ParsedDoc<MatchupFrontmatter>[] {
  return readDirSafe("matchups").map((f) =>
    parseFile<MatchupFrontmatter>(path.join(CONTENT_ROOT, "matchups", f)),
  );
}

export function getMatchupBySlug(
  slug: string,
): ParsedDoc<MatchupFrontmatter> | null {
  const ms = getAllMatchups();
  return ms.find((m) => m.data.slug === slug) ?? null;
}

export function getAllGlossaryTerms(): ParsedDoc<GlossaryFrontmatter>[] {
  return readDirSafe("glossary").map((f) =>
    parseFile<GlossaryFrontmatter>(path.join(CONTENT_ROOT, "glossary", f)),
  );
}

export function getGlossaryTermBySlug(
  slug: string,
): ParsedDoc<GlossaryFrontmatter> | null {
  const terms = getAllGlossaryTerms();
  return terms.find((t) => t.data.slug === slug) ?? null;
}

export function sortByDateDesc<T extends { date: string }>(
  docs: ParsedDoc<T>[],
): ParsedDoc<T>[] {
  return [...docs].sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );
}
