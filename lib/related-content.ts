import type { ParsedDoc } from "@/lib/content/types";
import type {
  CharacterFrontmatter,
  GlossaryFrontmatter,
  GuideFrontmatter,
  MatchupFrontmatter,
} from "@/lib/content/types";
import {
  getAllCharacters,
  getAllGlossaryTerms,
  getAllGuides,
  getAllMatchups,
} from "@/lib/content/load";
import { getCharacterNameFromTitle } from "@/lib/character-title";

export type LabeledRelatedLink = {
  title: string;
  href: string;
  label: string;
};

export type RelatedLink = {
  title: string;
  href: string;
  ariaLabel?: string;
};

type ScoreRow<T> = {
  doc: ParsedDoc<T>;
  score: number;
};

const archetypeTags = new Set([
  "rushdown",
  "zoners",
  "zoner",
  "swordies",
  "sword",
  "heavyweights",
  "heavyweight",
  "traps",
  "trapper",
  "counterplay",
  "tempo",
  "spacing",
  "defense",
  "offense",
  "floaty",
  "all-rounder",
]);

function toTimeValue(date?: string): number {
  if (!date) return 0;
  const value = Date.parse(date);
  return Number.isNaN(value) ? 0 : value;
}

function contentTimestamp(data: { date: string; updated?: string }): number {
  return toTimeValue(data.updated ?? data.date);
}

function toTokens(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter(Boolean);
}

function toMatchupChipLabel(title: string): string {
  return title
    .replace(/\s*\(Smash Ultimate\)\s*$/i, "")
    .replace(/\s*Matchup Guide\s*$/i, "")
    .replace(/\s*Matchup Fundamentals\s*$/i, " Fundamentals")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function toGuideChipLabel(title: string): string {
  return title
    .replace(/^How to\s+/i, "")
    .replace(/^What Is\s+/i, "")
    .replace(/\s+in Smash Ultimate\??$/i, "")
    .replace(/\s+\(Smash Ultimate\)\s*$/i, "")
    .replace(/\s+\(Beginner Guide\)\s*$/i, " Basics")
    .replace(/\s+\(Practical Guide\)\s*$/i, "")
    .replace(/\?$/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function toGuideChipLabelBySlug(slug: string, title: string): string {
  const map: Record<string, string> = {
    "beginner-edgeguarding": "Edgeguarding Basics",
    "beginner-ledgetrapping": "Ledgetrapping Basics",
    "best-training-mode-drills": "Training Mode Practice",
    "how-to-keep-advantage": "Maintain Advantage",
    "what-is-neutral": "Neutral",
    "understanding-stage-control": "Stage Control",
    "understanding-smash-ultimate-di": "DI Basics",
    "out-of-shield-options": "Out-of-Shield Choices",
    "how-to-whiff-punish": "Whiff Punishing",
    "how-to-space-safely": "Safe Spacing",
    "how-to-read-opponents": "Opponent Reads",
    "how-to-improve-shield-pressure": "Shield Pressure",
    "how-to-recover-better": "Recovery Routes",
    "how-to-fight-zoners": "Anti-Zoner Strategy",
    "how-to-avoid-panic-options": "Anti-Panic Defense",
    "burst-range-explained": "Burst Range",
    "improve-advantage-state": "Advantage State",
    "how-to-tech": "Tech Defense",
    "how-to-short-hop": "Short-Hop Timing",
    "how-to-fast-fall-consistently": "Fast-Fall Timing",
    "beginner-practice-routine": "Beginner Practice Plan",
  };
  return map[slug] ?? toGuideChipLabel(title);
}

function normalizeTags(tags?: string[]): string[] {
  return (tags ?? []).map((tag) => tag.toLowerCase().trim());
}

function primaryTag(tags?: string[]): string | null {
  const normalized = normalizeTags(tags);
  return normalized.length > 0 ? normalized[0] : null;
}

function difficultyDistance(a?: string, b?: string): number {
  const order = ["beginner", "intermediate", "advanced"];
  const ai = a ? order.indexOf(a.toLowerCase()) : -1;
  const bi = b ? order.indexOf(b.toLowerCase()) : -1;
  if (ai < 0 || bi < 0) return 99;
  return Math.abs(ai - bi);
}

function recentBonus(
  currentTime: number,
  sortedTimes: number[],
  candidateTime: number,
): number {
  if (candidateTime === 0 || currentTime === 0 || sortedTimes.length === 0) return 0;
  const topCut = Math.max(1, Math.ceil(sortedTimes.length * 0.3));
  const threshold = sortedTimes[topCut - 1] ?? 0;
  return candidateTime >= threshold ? 5 : 0;
}

function sortRows<T extends { slug: string; date: string; updated?: string }>(
  rows: ScoreRow<T>[],
) {
  return rows.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const bt = contentTimestamp(b.doc.data);
    const at = contentTimestamp(a.doc.data);
    if (bt !== at) return bt - at;
    return a.doc.data.slug.localeCompare(b.doc.data.slug);
  });
}

function addManualGuideLink(
  links: LabeledRelatedLink[],
  seen: Set<string>,
  bySlug: Map<string, ParsedDoc<GuideFrontmatter>>,
  slug: string,
  currentSlug: string,
  label: string,
) {
  if (!slug || slug === currentSlug || seen.has(slug)) return;
  const doc = bySlug.get(slug);
  if (!doc) return;
  seen.add(slug);
  links.push({ title: doc.data.title, href: `/guides/${slug}`, label });
}

export function scoreGuideRecommendations(
  currentSlug: string,
  limit = 4,
): LabeledRelatedLink[] {
  const guides = getAllGuides();
  const bySlug = new Map(guides.map((guide) => [guide.data.slug, guide]));
  const current = bySlug.get(currentSlug);
  if (!current) return [];

  const links: LabeledRelatedLink[] = [];
  const seen = new Set<string>();

  addManualGuideLink(
    links,
    seen,
    bySlug,
    current.data.nextGuideSlug ?? "",
    currentSlug,
    "RECOMMENDED NEXT",
  );

  if (
    current.data.progressionTrack &&
    typeof current.data.progressionStep === "number"
  ) {
    const nextTrackDoc = guides
      .filter((guide) => guide.data.progressionTrack === current.data.progressionTrack)
      .find(
        (guide) =>
          (guide.data.progressionStep ?? 0) === (current.data.progressionStep ?? 0) + 1,
      );
    if (nextTrackDoc) {
      addManualGuideLink(
        links,
        seen,
        bySlug,
        nextTrackDoc.data.slug,
        currentSlug,
        "NEXT CONCEPT",
      );
    }
  }

  for (const slug of current.data.relatedGuides ?? []) {
    const related = bySlug.get(slug);
    const label =
      related?.data.difficulty?.toLowerCase() === "beginner"
        ? "FOUNDATIONAL"
        : "INTERMEDIATE";
    addManualGuideLink(links, seen, bySlug, slug, currentSlug, label);
    if (links.length >= limit) return links.slice(0, limit);
  }

  const currentTags = normalizeTags(current.data.tags);
  const currentTagSet = new Set(currentTags);
  const currentPrimaryTag = primaryTag(current.data.tags);
  const currentTokens = new Set(toTokens(current.data.title));
  const allTimes = guides
    .map((guide) => contentTimestamp(guide.data))
    .sort((a, b) => b - a);
  const currentTime = contentTimestamp(current.data);

  const rows: ScoreRow<GuideFrontmatter>[] = [];
  for (const candidate of guides) {
    if (candidate.data.slug === currentSlug || seen.has(candidate.data.slug)) continue;
    let score = 0;

    if (current.data.character && candidate.data.character === current.data.character) {
      score += 50;
    }

    const candidateTags = normalizeTags(candidate.data.tags);
    const candidatePrimaryTag = primaryTag(candidate.data.tags);
    if (currentPrimaryTag && candidatePrimaryTag && currentPrimaryTag === candidatePrimaryTag) {
      score += 30;
    }
    for (const tag of candidateTags) {
      if (currentTagSet.has(tag)) score += 12;
    }

    if (current.data.category && candidate.data.category === current.data.category) {
      score += 20;
    }
    if (
      current.data.progressionTrack &&
      candidate.data.progressionTrack === current.data.progressionTrack
    ) {
      score += 20;
      const stepGap = Math.abs(
        (candidate.data.progressionStep ?? 0) - (current.data.progressionStep ?? 0),
      );
      if (stepGap === 1) score += 10;
    }

    if (difficultyDistance(current.data.difficulty, candidate.data.difficulty) <= 1) {
      score += 10;
    }

    const candidateTokens = toTokens(candidate.data.title);
    for (const token of candidateTokens) {
      if (currentTokens.has(token)) score += 4;
    }

    score += recentBonus(currentTime, allTimes, contentTimestamp(candidate.data));

    if (score > 0) rows.push({ doc: candidate, score });
  }

  for (const row of sortRows(rows)) {
    if (links.length >= limit) break;
    const label =
      row.doc.data.difficulty?.toLowerCase() === "beginner"
        ? "FOUNDATIONAL"
        : "INTERMEDIATE";
    links.push({
      title: row.doc.data.title,
      href: `/guides/${row.doc.data.slug}`,
      label,
    });
    seen.add(row.doc.data.slug);
  }

  return links.slice(0, limit);
}

export function scoreGlossaryRelatedConcepts(
  currentSlug: string,
  limit = 5,
): RelatedLink[] {
  const terms = getAllGlossaryTerms();
  const bySlug = new Map(terms.map((term) => [term.data.slug, term]));
  const current = bySlug.get(currentSlug);
  if (!current) return [];

  const links: RelatedLink[] = [];
  const seen = new Set<string>();

  for (const slug of current.data.relatedTerms ?? []) {
    const term = bySlug.get(slug);
    if (!term || slug === currentSlug || seen.has(slug)) continue;
    seen.add(slug);
    links.push({ title: term.data.title, href: `/glossary/${slug}` });
    if (links.length >= limit) return links.slice(0, limit);
  }

  const currentTags = normalizeTags(current.data.tags);
  const currentTagSet = new Set(currentTags);
  const currentPrimaryTag = primaryTag(current.data.tags);
  const currentTokens = new Set(toTokens(current.data.title));
  const allTimes = terms
    .map((term) => contentTimestamp(term.data))
    .sort((a, b) => b - a);
  const currentTime = contentTimestamp(current.data);

  const rows: ScoreRow<GlossaryFrontmatter>[] = [];
  for (const candidate of terms) {
    if (candidate.data.slug === currentSlug || seen.has(candidate.data.slug)) continue;
    let score = 0;

    const candidateTags = normalizeTags(candidate.data.tags);
    const candidateTagSet = new Set(candidateTags);
    const candidatePrimaryTag = primaryTag(candidate.data.tags);
    if (currentPrimaryTag && candidatePrimaryTag && currentPrimaryTag === candidatePrimaryTag) {
      score += 30;
    }
    for (const tag of candidateTags) {
      if (currentTagSet.has(tag)) score += 12;
    }

    if (current.data.category && candidate.data.category === current.data.category) {
      score += 20;
    }

    const candidateTokens = toTokens(candidate.data.title);
    for (const token of candidateTokens) {
      if (currentTokens.has(token)) score += 8;
    }

    for (const token of currentTokens) {
      if (candidateTagSet.has(token)) score += 6;
    }

    score += recentBonus(currentTime, allTimes, contentTimestamp(candidate.data));
    if (score > 0) rows.push({ doc: candidate, score });
  }

  for (const row of sortRows(rows)) {
    if (links.length >= limit) break;
    links.push({
      title: row.doc.data.title,
      href: `/glossary/${row.doc.data.slug}`,
    });
    seen.add(row.doc.data.slug);
  }

  return links.slice(0, limit);
}

function getCharacterPrimaryArchetype(character: ParsedDoc<CharacterFrontmatter>): string | null {
  const tags = normalizeTags(character.data.tags);
  return tags.find((tag) => archetypeTags.has(tag)) ?? null;
}

function extractMatchupParticipants(
  matchup: ParsedDoc<MatchupFrontmatter>,
  knownCharacterSlugs: Set<string>,
): string[] {
  const participants = new Set<string>();
  if (matchup.data.slug.includes("-vs-")) {
    for (const part of matchup.data.slug.split("-vs-")) {
      if (knownCharacterSlugs.has(part)) participants.add(part);
    }
  }
  for (const tag of normalizeTags(matchup.data.tags)) {
    if (knownCharacterSlugs.has(tag)) participants.add(tag);
  }
  return Array.from(participants);
}

export function scoreCharacterRelatedContent(
  currentSlug: string,
  guideLimit = 5,
  fighterLimit = 4,
): { guides: RelatedLink[]; fighters: RelatedLink[] } {
  const characters = getAllCharacters();
  const guideDocs = getAllGuides();
  const matchups = getAllMatchups();
  const characterBySlug = new Map(
    characters.map((characterDoc) => [characterDoc.data.slug, characterDoc]),
  );
  const current = characterBySlug.get(currentSlug);
  if (!current) return { guides: [], fighters: [] };

  const characterSlugSet = new Set(characters.map((characterDoc) => characterDoc.data.slug));
  const currentTags = normalizeTags(current.data.tags);
  const currentTagSet = new Set(currentTags);
  const currentPrimaryTag = primaryTag(current.data.tags);
  const currentArchetype = getCharacterPrimaryArchetype(current);
  const currentTime = contentTimestamp(current.data);

  const guideTimes = guideDocs
    .map((guideDoc) => contentTimestamp(guideDoc.data))
    .sort((a, b) => b - a);

  const guideLinks: RelatedLink[] = [];
  const guideSeen = new Set<string>();
  const guideBySlug = new Map(
    guideDocs.map((guideDoc) => [guideDoc.data.slug, guideDoc]),
  );

  for (const slug of current.data.relatedGuides ?? []) {
    const doc = guideBySlug.get(slug);
    if (!doc || guideSeen.has(slug)) continue;
    guideSeen.add(slug);
    guideLinks.push({
      title: toGuideChipLabelBySlug(doc.data.slug, doc.data.title),
      href: `/guides/${slug}`,
      ariaLabel: `Open guide: ${doc.data.title}`,
    });
    if (guideLinks.length >= guideLimit) break;
  }

  for (const slug of current.data.roadmapGuides ?? []) {
    const doc = guideBySlug.get(slug);
    if (!doc || guideSeen.has(slug)) continue;
    guideSeen.add(slug);
    guideLinks.push({
      title: toGuideChipLabelBySlug(doc.data.slug, doc.data.title),
      href: `/guides/${slug}`,
      ariaLabel: `Open guide: ${doc.data.title}`,
    });
    if (guideLinks.length >= guideLimit) break;
  }

  const guideRows: ScoreRow<GuideFrontmatter>[] = [];
  const archetypeGuideTagMap: Record<string, string[]> = {
    zoner: ["spacing", "neutral", "projectiles", "defense"],
    rushdown: ["advantage state", "pressure", "movement", "whiff punish"],
    swordies: ["spacing", "neutral", "advantage state"],
    sword: ["spacing", "neutral", "advantage state"],
    heavyweights: ["advantage state", "ledgetrapping", "disadvantage state"],
    heavyweight: ["advantage state", "ledgetrapping", "disadvantage state"],
    floaty: ["disadvantage state", "movement", "landing"],
    "all-rounder": ["neutral", "advantage state", "fundamentals"],
  };
  const characterGuideProfiles: Record<
    string,
    { tags: string[]; slugs: string[] }
  > = {
    bowser: {
      tags: ["ledgetrapping", "advantage state", "spacing", "pressure", "zoners"],
      slugs: [
        "beginner-ledgetrapping",
        "improve-advantage-state",
        "how-to-space-safely",
        "how-to-fight-zoners",
        "burst-range-explained",
      ],
    },
    fox: {
      tags: ["whiff punish", "pressure", "frame traps", "advantage state"],
      slugs: [
        "how-to-whiff-punish",
        "how-to-improve-shield-pressure",
        "improve-advantage-state",
        "how-to-keep-advantage",
      ],
    },
    cloud: {
      tags: ["spacing", "projectiles", "edgeguarding", "stage control"],
      slugs: [
        "how-to-space-safely",
        "how-to-fight-zoners",
        "beginner-edgeguarding",
        "understanding-stage-control",
      ],
    },
  };
  const preferredGuideTags = new Set(
    currentArchetype ? (archetypeGuideTagMap[currentArchetype] ?? []) : [],
  );
  const characterProfile = characterGuideProfiles[currentSlug];
  const characterSpecificTags = new Set(characterProfile?.tags ?? []);
  const characterSpecificSlugs = new Set(characterProfile?.slugs ?? []);
  const preferredGuideCategories = new Set<string>([
    "Neutral",
    "Advantage",
    "Defense",
    "Disadvantage",
    "Movement",
    "Mindset",
    "Training",
  ]);

  for (const guideDoc of guideDocs) {
    if (guideSeen.has(guideDoc.data.slug)) continue;
    let score = 0;
    const guideTags = normalizeTags(guideDoc.data.tags);
    const guidePrimaryTag = primaryTag(guideDoc.data.tags);

    if (guideDoc.data.character === currentSlug) score += 50;
    if (guideTags.includes(currentSlug)) score += 50;
    if (characterSpecificSlugs.has(guideDoc.data.slug)) score += 35;

    if (currentPrimaryTag && guidePrimaryTag && currentPrimaryTag === guidePrimaryTag) {
      score += 30;
    }
    for (const tag of guideTags) {
      if (currentTagSet.has(tag)) score += 10;
      if (preferredGuideTags.has(tag)) score += 15;
      if (characterSpecificTags.has(tag)) score += 20;
    }
    if (
      guideDoc.data.category &&
      preferredGuideCategories.has(guideDoc.data.category)
    ) {
      score += 20;
    }
    if (difficultyDistance(current.data.difficulty, guideDoc.data.difficulty) <= 1) {
      score += 10;
    }
    score += recentBonus(currentTime, guideTimes, contentTimestamp(guideDoc.data));

    if (score > 0) guideRows.push({ doc: guideDoc, score });
  }

  for (const row of sortRows(guideRows)) {
    if (guideLinks.length >= guideLimit) break;
    if (guideSeen.has(row.doc.data.slug)) continue;
    guideSeen.add(row.doc.data.slug);
    guideLinks.push({
      title: toGuideChipLabelBySlug(row.doc.data.slug, row.doc.data.title),
      href: `/guides/${row.doc.data.slug}`,
      ariaLabel: `Open guide: ${row.doc.data.title}`,
    });
  }

  const fighterRows: ScoreRow<CharacterFrontmatter>[] = [];
  const fighterTimes = characters
    .map((characterDoc) => contentTimestamp(characterDoc.data))
    .sort((a, b) => b - a);
  for (const characterDoc of characters) {
    if (characterDoc.data.slug === currentSlug) continue;
    let score = 0;

    const appearsTogether = matchups.some((matchupDoc) => {
      const participants = extractMatchupParticipants(matchupDoc, characterSlugSet);
      return (
        participants.includes(currentSlug) &&
        participants.includes(characterDoc.data.slug)
      );
    });
    if (appearsTogether) score += 40;

    const candidateTags = normalizeTags(characterDoc.data.tags);
    const candidatePrimaryTag = primaryTag(characterDoc.data.tags);
    if (currentPrimaryTag && candidatePrimaryTag && currentPrimaryTag === candidatePrimaryTag) {
      score += 30;
    }
    if (currentArchetype && candidateTags.includes(currentArchetype)) score += 15;
    if (difficultyDistance(current.data.difficulty, characterDoc.data.difficulty) <= 1) {
      score += 10;
    }
    score += recentBonus(currentTime, fighterTimes, contentTimestamp(characterDoc.data));

    if (score > 0) fighterRows.push({ doc: characterDoc, score });
  }

  const fighters: RelatedLink[] = [];
  for (const row of sortRows(fighterRows)) {
    if (fighters.length >= fighterLimit) break;
    fighters.push({
      title: getCharacterNameFromTitle(row.doc.data.title),
      href: `/characters/${row.doc.data.slug}`,
    });
  }

  return {
    guides: guideLinks.slice(0, guideLimit),
    fighters,
  };
}

export function scoreMatchupRelatedContent(
  currentSlug: string,
  matchupLimit = 6,
  fighterLimit = 5,
): { matchups: RelatedLink[]; fighters: RelatedLink[] } {
  const matchups = getAllMatchups();
  const bySlug = new Map(matchups.map((matchupDoc) => [matchupDoc.data.slug, matchupDoc]));
  const current = bySlug.get(currentSlug);
  if (!current) return { matchups: [], fighters: [] };

  const characters = getAllCharacters();
  const characterSlugSet = new Set(characters.map((characterDoc) => characterDoc.data.slug));
  const currentParticipants = new Set(
    extractMatchupParticipants(current, characterSlugSet),
  );
  const currentTags = normalizeTags(current.data.tags);
  const currentTagSet = new Set(currentTags);
  const currentPrimaryTag = primaryTag(current.data.tags);
  const currentArchetype = currentTags.find((tag) => archetypeTags.has(tag)) ?? null;
  const currentTime = contentTimestamp(current.data);
  const matchupTimes = matchups
    .map((matchupDoc) => contentTimestamp(matchupDoc.data))
    .sort((a, b) => b - a);

  const links: RelatedLink[] = [];
  const seen = new Set<string>();
  for (const slug of current.data.nextMatchups ?? []) {
    const doc = bySlug.get(slug);
    if (!doc || slug === currentSlug || seen.has(slug)) continue;
    seen.add(slug);
    links.push({
      title: toMatchupChipLabel(doc.data.title),
      href: `/matchups/${slug}`,
      ariaLabel: `Open matchup guide: ${doc.data.title}`,
    });
    if (links.length >= matchupLimit) break;
  }

  const rows: ScoreRow<MatchupFrontmatter>[] = [];
  for (const candidate of matchups) {
    if (candidate.data.slug === currentSlug || seen.has(candidate.data.slug)) continue;
    let score = 0;

    const candidateParticipants = extractMatchupParticipants(candidate, characterSlugSet);
    const participantOverlap = candidateParticipants.filter((slug) =>
      currentParticipants.has(slug),
    );
    if (participantOverlap.length > 0) {
      score += 50 * participantOverlap.length;
      score += 40;
    }

    const candidateTags = normalizeTags(candidate.data.tags);
    const candidatePrimaryTag = primaryTag(candidate.data.tags);
    if (currentPrimaryTag && candidatePrimaryTag && currentPrimaryTag === candidatePrimaryTag) {
      score += 30;
    }
    for (const tag of candidateTags) {
      if (currentTagSet.has(tag)) score += 10;
    }
    if (current.data.category && candidate.data.category === current.data.category) {
      score += 20;
    }
    if (currentArchetype && candidateTags.includes(currentArchetype)) score += 15;
    if (difficultyDistance(current.data.difficulty, candidate.data.difficulty) <= 1) {
      score += 10;
    }
    score += recentBonus(currentTime, matchupTimes, contentTimestamp(candidate.data));

    if (score > 0) rows.push({ doc: candidate, score });
  }

  for (const row of sortRows(rows)) {
    if (links.length >= matchupLimit) break;
    seen.add(row.doc.data.slug);
    links.push({
      title: toMatchupChipLabel(row.doc.data.title),
      href: `/matchups/${row.doc.data.slug}`,
      ariaLabel: `Open matchup guide: ${row.doc.data.title}`,
    });
  }

  const fighterRows: ScoreRow<CharacterFrontmatter>[] = [];
  const fighterTimes = characters
    .map((characterDoc) => contentTimestamp(characterDoc.data))
    .sort((a, b) => b - a);

  for (const characterDoc of characters) {
    let score = 0;
    const slug = characterDoc.data.slug;
    const candidateTags = normalizeTags(characterDoc.data.tags);
    const candidatePrimaryTag = primaryTag(characterDoc.data.tags);
    const candidateArchetype =
      candidateTags.find((tag) => archetypeTags.has(tag)) ?? null;

    if (currentParticipants.has(slug)) score += 50;

    const appearsInConnectedMatchup = links.some((link) => {
      const connectedSlug = link.href.replace("/matchups/", "");
      const doc = bySlug.get(connectedSlug);
      if (!doc) return false;
      const parts = extractMatchupParticipants(doc, characterSlugSet);
      return parts.includes(slug);
    });
    if (appearsInConnectedMatchup) score += 40;

    if (currentPrimaryTag && candidatePrimaryTag && currentPrimaryTag === candidatePrimaryTag) {
      score += 30;
    }
    if (currentArchetype && candidateArchetype && currentArchetype === candidateArchetype) {
      score += 15;
    }
    if (difficultyDistance(current.data.difficulty, characterDoc.data.difficulty) <= 1) {
      score += 10;
    }
    score += recentBonus(currentTime, fighterTimes, contentTimestamp(characterDoc.data));

    if (score > 0) fighterRows.push({ doc: characterDoc, score });
  }

  const fighters: RelatedLink[] = [];
  const fighterSeen = new Set<string>();
  for (const row of sortRows(fighterRows)) {
    if (fighters.length >= fighterLimit) break;
    if (fighterSeen.has(row.doc.data.slug)) continue;
    fighterSeen.add(row.doc.data.slug);
    fighters.push({
      title: getCharacterNameFromTitle(row.doc.data.title),
      href: `/characters/${row.doc.data.slug}`,
    });
  }

  return {
    matchups: links.slice(0, matchupLimit),
    fighters,
  };
}
