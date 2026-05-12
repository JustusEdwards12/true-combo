import { absoluteUrl } from "@/lib/seo";
import { getSiteUrl, SITE_NAME } from "@/lib/site";

type ArticleJsonLdProps = {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
};

export function ArticleJsonLd({
  title,
  description,
  path,
  datePublished,
  dateModified,
}: ArticleJsonLdProps) {
  const url = absoluteUrl(path);
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: getSiteUrl(),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: getSiteUrl(),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
