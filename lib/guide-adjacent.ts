import type { GuideFrontmatter } from "./content/types";
import { getAllGuides } from "./content/load";
import type { ParsedDoc } from "./content/types";

/** Chronological order (oldest first) for prev/next navigation. */
export function getGuidesChronological(): ParsedDoc<GuideFrontmatter>[] {
  return [...getAllGuides()].sort(
    (a, b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime(),
  );
}

export function getAdjacentGuides(slug: string): {
  prev: ParsedDoc<GuideFrontmatter> | null;
  next: ParsedDoc<GuideFrontmatter> | null;
} {
  const list = getGuidesChronological();
  const i = list.findIndex((g) => g.data.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? list[i - 1]! : null,
    next: i < list.length - 1 ? list[i + 1]! : null,
  };
}
