import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const contentRoot = path.join(root, "content");

function readDocs(folder) {
  const dir = path.join(contentRoot, folder);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((file) => {
      const full = path.join(dir, file);
      const raw = fs.readFileSync(full, "utf8");
      const parsed = matter(raw);
      return {
        file: full,
        slug: parsed.data.slug,
        data: parsed.data,
        content: parsed.content,
      };
    });
}

const guides = readDocs("guides");
const characters = readDocs("characters");
const matchups = readDocs("matchups");
const glossary = readDocs("glossary");

const guideSlugs = new Set(guides.map((d) => d.slug));
const allRoutes = new Set([
  "/",
  "/guides",
  "/characters",
  "/matchups",
  "/glossary",
  "/about",
  ...guides.map((d) => `/guides/${d.slug}`),
  ...characters.map((d) => `/characters/${d.slug}`),
  ...matchups.map((d) => `/matchups/${d.slug}`),
  ...glossary.map((d) => `/glossary/${d.slug}`),
]);

const issues = [];

function checkRelatedGuides(doc) {
  for (const slug of doc.data.relatedGuides ?? []) {
    if (!guideSlugs.has(slug)) {
      issues.push(
        `${path.relative(root, doc.file)}: relatedGuides contains unknown slug "${slug}"`,
      );
    }
  }
}

for (const d of [...guides, ...characters, ...matchups, ...glossary]) {
  checkRelatedGuides(d);
}

const hrefRegex = /\]\((\/[^)\s]+)\)/g;

for (const doc of [...guides, ...characters, ...matchups, ...glossary]) {
  const rel = path.relative(root, doc.file);
  let match;
  while ((match = hrefRegex.exec(doc.content)) !== null) {
    const href = match[1];
    const clean = href.split("#")[0];
    if (!clean || clean.startsWith("//")) continue;
    if (clean.startsWith("/guides#")) continue;
    if (!allRoutes.has(clean)) {
      issues.push(`${rel}: broken internal link "${href}"`);
    }
  }
}

if (issues.length > 0) {
  console.error(`Content link validation failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log("Content link validation passed.");
