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
import { scoreGuideRecommendations } from "@/lib/related-content";
import { stripFrontmatter } from "@/lib/toc";

export function extractFirstBulletPoints(markdown: string, max = 4): string[] {
  const body = stripFrontmatter(markdown);
  const lines = body.split("\n");
  type Candidate = { heading: string; bullets: string[] };
  const candidates: Candidate[] = [];

  let currentHeading = "";
  let currentBullets: string[] = [];

  const flushCandidate = () => {
    if (currentBullets.length > 0) {
      candidates.push({ heading: currentHeading, bullets: [...currentBullets] });
    }
    currentBullets = [];
  };

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    if (h2 || h3) {
      flushCandidate();
      currentHeading = (h2?.[1] ?? h3?.[1] ?? "").trim();
      continue;
    }

    const bullet = line.match(/^\s*-\s+(.+)$/);
    if (bullet) {
      currentBullets.push(bullet[1].trim());
      continue;
    }

    if (currentBullets.length > 0 && line.trim() === "") {
      flushCandidate();
    }
  }
  flushCandidate();

  const headingScore = (heading: string) => {
    const h = heading.toLowerCase();
    if (!h) return 0;

    if (h.includes("key takeaway")) return 100;
    if (h.includes("what to focus on first")) return 90;
    if (h.includes("focus first")) return 85;
    if (h.includes("core game plan") || h.includes("game plan")) return 80;
    if (h.includes("adaptation")) return 70;
    if (h.includes("practical") || h.includes("training focus")) return 60;

    if (
      h.includes("common beginner mistakes") ||
      h.includes("common mistakes") ||
      h.includes("beginners get wrong") ||
      h.includes("panic")
    ) {
      return -100;
    }

    return 10;
  };

  const cleaned = candidates
    .map((c) => ({
      ...c,
      score: headingScore(c.heading),
      bullets: c.bullets
        .map((b) => b.replace(/\s+/g, " ").trim())
        .filter((b) => b.length > 0),
    }))
    .filter((c) => c.bullets.length > 0)
    .sort((a, b) => b.score - a.score);

  const best = cleaned.find((c) => c.score > 0);
  if (!best) return [];

  return best.bullets.slice(0, max);
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
  return scoreGuideRecommendations(currentSlug, 4);
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
