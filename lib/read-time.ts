/** ~200 wpm editorial read speed for markdown body text. */
export function readingTimeFromMarkdown(markdown: string): number {
  const stripped = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/^---[\s\S]*?---/m, " ")
    .replace(/[#>*_`|~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = stripped ? stripped.split(" ").length : 0;
  return Math.max(1, Math.round(words / 200));
}
