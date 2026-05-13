import type { FaqItem } from "@/components/article/FAQSection";
import type { ParsedDoc } from "@/lib/content/types";
import type {
  CharacterFrontmatter,
  GuideFrontmatter,
  GlossaryFrontmatter,
  MatchupFrontmatter,
} from "@/lib/content/types";
import {
  getAllGlossaryTerms,
  getAllGuides,
  getAllMatchups,
} from "@/lib/content/load";
import { stripFrontmatter } from "@/lib/toc";

export function extractFirstBulletPoints(markdown: string, max = 4): string[] {
  const body = stripFrontmatter(markdown);
  const lines = body.split("\n");
  const points: string[] = [];
  let inBulletBlock = false;

  for (const line of lines) {
    const bullet = line.match(/^\s*-\s+(.+)$/);
    if (bullet) {
      inBulletBlock = true;
      points.push(bullet[1].trim());
      if (points.length >= max) break;
      continue;
    }

    if (inBulletBlock && line.trim() === "") break;
  }

  return points;
}

export function extractFaqFromMarkdown(markdown: string): FaqItem[] {
  const body = stripFrontmatter(markdown);
  const lines = body.split("\n");
  const faq: FaqItem[] = [];

  let inFaqSection = false;
  let currentQuestion: string | null = null;
  let answerLines: string[] = [];

  const flush = () => {
    if (!currentQuestion) return;
    const answer = answerLines.join(" ").replace(/\s+/g, " ").trim();
    if (answer.length > 0) faq.push({ question: currentQuestion, answer });
    currentQuestion = null;
    answerLines = [];
  };

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);

    if (h2) {
      if (/^faq$/i.test(h2[1].trim())) {
        inFaqSection = true;
        continue;
      }
      if (inFaqSection) {
        flush();
        break;
      }
    }

    if (!inFaqSection) continue;

    if (h3) {
      flush();
      currentQuestion = h3[1].trim();
      continue;
    }

    if (currentQuestion && line.trim().length > 0) {
      answerLines.push(line.trim());
    }
  }

  flush();
  return faq.slice(0, 6);
}

export type ProgressionRecommendation = {
  title: string;
  href: string;
  label: string;
};

function mapGuidesBySlug() {
  const guides = getAllGuides();
  return {
    guides,
    bySlug: new Map(guides.map((g) => [g.data.slug, g])),
  };
}

export function buildGuideProgressionLinks(
  currentSlug: string,
): ProgressionRecommendation[] {
  const { guides, bySlug } = mapGuidesBySlug();
  const current = bySlug.get(currentSlug);
  if (!current) return [];

  const links: ProgressionRecommendation[] = [];

  if (current.data.nextGuideSlug) {
    const explicit = bySlug.get(current.data.nextGuideSlug);
    if (explicit) {
      links.push({
        title: explicit.data.title,
        href: `/guides/${explicit.data.slug}`,
        label: "Next lesson",
      });
    }
  }

  if (
    current.data.progressionTrack &&
    typeof current.data.progressionStep === "number"
  ) {
    const sameTrack = guides
      .filter((g) => g.data.progressionTrack === current.data.progressionTrack)
      .sort(
        (a, b) => (a.data.progressionStep ?? 0) - (b.data.progressionStep ?? 0),
      );
    const nextTrack = sameTrack.find(
      (g) => (g.data.progressionStep ?? 0) === current.data.progressionStep! + 1,
    );
    if (nextTrack) {
      links.push({
        title: nextTrack.data.title,
        href: `/guides/${nextTrack.data.slug}`,
        label: "Track step",
      });
    }
  }

  for (const slug of current.data.relatedGuides ?? []) {
    const doc = bySlug.get(slug);
    if (!doc) continue;
    if (doc.data.slug === currentSlug) continue;
    if (links.some((l) => l.href === `/guides/${doc.data.slug}`)) continue;
    links.push({
      title: doc.data.title,
      href: `/guides/${doc.data.slug}`,
      label: "Related guide",
    });
    if (links.length >= 4) break;
  }

  return links.slice(0, 4);
}

export function buildCharacterRoadmapLinks(
  currentCharacter: ParsedDoc<CharacterFrontmatter>,
): ProgressionRecommendation[] {
  const { bySlug } = mapGuidesBySlug();
  const links: ProgressionRecommendation[] = [];
  for (const slug of currentCharacter.data.roadmapGuides ?? []) {
    const doc = bySlug.get(slug);
    if (!doc) continue;
    links.push({
      title: doc.data.title,
      href: `/guides/${doc.data.slug}`,
      label: "Roadmap",
    });
    if (links.length >= 5) break;
  }
  return links;
}

export function buildMatchupNextLinks(
  currentMatchup: ParsedDoc<MatchupFrontmatter>,
): ProgressionRecommendation[] {
  const matchups = getAllMatchups();
  const bySlug = new Map(matchups.map((m) => [m.data.slug, m]));
  const links: ProgressionRecommendation[] = [];
  for (const slug of currentMatchup.data.nextMatchups ?? []) {
    const doc = bySlug.get(slug);
    if (!doc) continue;
    links.push({
      title: doc.data.title,
      href: `/matchups/${doc.data.slug}`,
      label: "Next matchup",
    });
    if (links.length >= 4) break;
  }
  return links;
}

export type ConceptLink = {
  title: string;
  href: string;
};

export function buildGuideConceptLinks(
  currentGuide: ParsedDoc<GuideFrontmatter>,
): ConceptLink[] {
  const glossary = getAllGlossaryTerms();
  const bySlug = new Map(glossary.map((t) => [t.data.slug, t]));

  const links: ConceptLink[] = [];

  for (const slug of currentGuide.data.relatedConcepts ?? []) {
    const term = bySlug.get(slug);
    if (!term) continue;
    links.push({ title: term.data.title, href: `/glossary/${term.data.slug}` });
  }

  if (links.length > 0) return links.slice(0, 4);

  const loweredTags = (currentGuide.data.tags ?? []).map((t) =>
    t.toLowerCase().replace(/\s+/g, "-"),
  );
  for (const term of glossary) {
    if (!loweredTags.includes(term.data.slug)) continue;
    links.push({ title: term.data.title, href: `/glossary/${term.data.slug}` });
    if (links.length >= 3) break;
  }

  return links;
}

export function buildMatchupConceptLinks(
  currentMatchup: ParsedDoc<MatchupFrontmatter>,
): ConceptLink[] {
  const glossary = getAllGlossaryTerms();
  const bySlug = new Map(glossary.map((t) => [t.data.slug, t]));
  const links: ConceptLink[] = [];

  for (const slug of currentMatchup.data.relatedConcepts ?? []) {
    const term = bySlug.get(slug);
    if (!term) continue;
    links.push({ title: term.data.title, href: `/glossary/${term.data.slug}` });
  }

  if (links.length > 0) return links.slice(0, 4);

  const loweredTags = (currentMatchup.data.tags ?? []).map((t) =>
    t.toLowerCase().replace(/\s+/g, "-"),
  );
  for (const term of glossary) {
    if (!loweredTags.includes(term.data.slug)) continue;
    links.push({ title: term.data.title, href: `/glossary/${term.data.slug}` });
    if (links.length >= 3) break;
  }
  return links;
}

export function getGlossaryBySlugOrNull(
  slug: string,
): ParsedDoc<GlossaryFrontmatter> | null {
  const glossary = getAllGlossaryTerms();
  return glossary.find((g) => g.data.slug === slug) ?? null;
}
