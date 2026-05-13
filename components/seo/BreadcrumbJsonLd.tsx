import type { BreadcrumbItem } from "@/components/Breadcrumbs";
import { absoluteUrl } from "@/lib/seo";

type BreadcrumbJsonLdProps = {
  items: BreadcrumbItem[];
  currentPath: string;
};

export function BreadcrumbJsonLd({ items, currentPath }: BreadcrumbJsonLdProps) {
  const list = items.map((item, idx) => {
    const isLast = idx === items.length - 1;
    const href = item.href ?? (isLast ? currentPath : "/");
    return {
      "@type": "ListItem",
      position: idx + 1,
      name: item.label,
      item: absoluteUrl(href),
    };
  });

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
