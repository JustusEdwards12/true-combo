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
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
};

export function buildPageTitle(title: string): string {
  if (title === SITE_NAME) return SITE_NAME;
  return `${title} | ${SITE_NAME}`;
}

export function buildMetadata({
  title,
  description,
  path = "/",
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
