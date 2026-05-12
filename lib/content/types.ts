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
}

export interface MatchupFrontmatter {
  title: string;
  description: string;
  slug: string;
  date: string;
  category?: string;
  tags?: string[];
  character?: string;
  difficulty?: string;
}

export interface GlossaryFrontmatter {
  title: string;
  description: string;
  slug: string;
  date: string;
  category?: string;
  tags?: string[];
}

export interface ParsedDoc<T> {
  data: T;
  content: string;
}
