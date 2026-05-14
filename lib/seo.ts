import type { Metadata } from "next";
import { getSiteUrl, SITE_NAME } from "./site";

export function absoluteUrl(path: string): string {
  const base = getSiteUrl().replace(/\/$/, "");
  if (!path || path === "/") return `${base}/`;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

type BuildMetadataOptions = {
  title: string;
  description: string;
  /** Path starting with / */
  path?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
};

type MetaDescriptionOptions = {
  minLength?: number;
  maxLength?: number;
  fallbackSentence?: string;
};

export function optimizeMetaDescription(
  description: string,
  {
    minLength = 140,
    maxLength = 160,
    fallbackSentence,
  }: MetaDescriptionOptions = {},
): string {
  const normalized = description.replace(/\s+/g, " ").trim();
  let text = normalized;

  if (!text && fallbackSentence) {
    text = fallbackSentence.trim();
  }

  if (fallbackSentence && text.length < minLength) {
    const suffix = fallbackSentence.trim();
    if (!text.toLowerCase().includes(suffix.toLowerCase())) {
      const separator = text.endsWith(".") || text.length === 0 ? " " : ". ";
      text = `${text}${separator}${suffix}`.replace(/\s+/g, " ").trim();
    }
  }

  if (text.length > maxLength) {
    const hardCut = text.slice(0, maxLength - 1).trimEnd();
    const softCutIndex = hardCut.lastIndexOf(" ");
    const safeCut =
      softCutIndex > Math.floor(maxLength * 0.6)
        ? hardCut.slice(0, softCutIndex).trimEnd()
        : hardCut;
    text = `${safeCut}.`;
  }

  return text;
}

export function buildPageTitle(title: string): string {
  if (title === SITE_NAME) return SITE_NAME;
  return `${title} | ${SITE_NAME}`;
}

export function buildMetadata({
  title,
  description,
  path = "/",
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex,
}: BuildMetadataOptions): Metadata {
  const base = getSiteUrl();
  const url = absoluteUrl(path);
  const fullTitle = buildPageTitle(title);

  return {
    title: fullTitle,
    description,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    metadataBase: new URL(base.endsWith("/") ? base : `${base}/`),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: type === "article" ? "article" : "website",
      locale: "en_US",
      ...(type === "article" && publishedTime
        ? { publishedTime, modifiedTime: modifiedTime ?? publishedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
