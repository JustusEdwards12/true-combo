import { slugifyHeading } from "./slugify";

export type TocEntry = { id: string; text: string; level: 2 | 3 };

/** Strip YAML frontmatter before parsing headings. */
export function stripFrontmatter(markdown: string): string {
  if (markdown.startsWith("---")) {
    const end = markdown.indexOf("\n---", 3);
    if (end !== -1) return markdown.slice(end + 4).trimStart();
  }
  return markdown;
}

export function extractTocFromMarkdown(markdown: string): TocEntry[] {
  const body = stripFrontmatter(markdown);
  const lines = body.split("\n");
  const toc: TocEntry[] = [];
  const used = new Set<string>();

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    if (h2) {
      const text = h2[1].trim();
      let id = slugifyHeading(text);
      while (used.has(id)) id = `${id}-more`;
      used.add(id);
      toc.push({ id, text, level: 2 });
    } else if (h3) {
      const text = h3[1].trim();
      let id = slugifyHeading(text);
      while (used.has(id)) id = `${id}-more`;
      used.add(id);
      toc.push({ id, text, level: 3 });
    }
  }
  return toc;
}
