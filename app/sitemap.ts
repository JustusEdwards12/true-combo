import type { MetadataRoute } from "next";
import {
  getAllCharacters,
  getAllGlossaryTerms,
  getAllGuides,
  getAllMatchups,
} from "@/lib/content/load";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl().replace(/\/$/, "");
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/guides",
    "/characters",
    "/matchups",
    "/glossary",
    "/about",
  ].map((path) => ({
    url: `${base}${path === "" ? "/" : path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const guides = getAllGuides().map((g) => ({
    url: `${base}/guides/${g.data.slug}`,
    lastModified: new Date(g.data.updated ?? g.data.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const characters = getAllCharacters().map((c) => ({
    url: `${base}/characters/${c.data.slug}`,
    lastModified: new Date(c.data.updated ?? c.data.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const matchups = getAllMatchups().map((m) => ({
    url: `${base}/matchups/${m.data.slug}`,
    lastModified: new Date(m.data.updated ?? m.data.date),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const glossary = getAllGlossaryTerms().map((t) => ({
    url: `${base}/glossary/${t.data.slug}`,
    lastModified: new Date(t.data.updated ?? t.data.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...guides, ...characters, ...matchups, ...glossary];
}
