import type { BreadcrumbItem } from "@/components/Breadcrumbs";
import { absoluteUrl } from "@/lib/seo";

type BreadcrumbJsonLdProps = {
  items: BreadcrumbItem[];
};

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const list = items.map((item, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    name: item.label,
    item: absoluteUrl(item.href ?? ""),
  }));

  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: list,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
