export interface GuideFrontmatter {
  title: string;
  description: string;
  slug: string;
  date: string;
  /** ISO date; defaults to `date` for SEO if omitted */
  updated?: string;
  category?: string;
  tags?: string[];
  character?: string;
  difficulty?: string;
  /** Slugs of related guides for internal linking */
  relatedGuides?: string[];
  /** Ordered track id for lesson progression (e.g. neutral-core) */
  progressionTrack?: string;
  /** Step position inside progressionTrack (1-based) */
  progressionStep?: number;
  /** Explicit next guide slug for progression handoff */
  nextGuideSlug?: string;
  /** Optional key takeaway bullets rendered near article intro */
  keyTakeaways?: string[];
  /** Optional FAQ blocks for snippet/schema support */
  faqs?: { question: string; answer: string }[];
  /** Optional related glossary slugs for concept reinforcement */
  relatedConcepts?: string[];
}

export interface CharacterFrontmatter {
  title: string;
  description: string;
  slug: string;
  date: string;
  updated?: string;
  category?: string;
  tags?: string[];
  character?: string;
  difficulty?: string;
  relatedGuides?: string[];
  relatedMatchups?: string[];
  roadmapGuides?: string[];
  relatedConcepts?: string[];
}

export interface MatchupFrontmatter {
  title: string;
  description: string;
  slug: string;
  date: string;
  updated?: string;
  category?: string;
  tags?: string[];
  character?: string;
  difficulty?: string;
  relatedGuides?: string[];
  relatedConcepts?: string[];
  nextMatchups?: string[];
}

export interface GlossaryFrontmatter {
  title: string;
  description: string;
  slug: string;
  date: string;
  category?: string;
  tags?: string[];
  updated?: string;
  relatedGuides?: string[];
  relatedTerms?: string[];
}

export interface ParsedDoc<T> {
  data: T;
  content: string;
}
