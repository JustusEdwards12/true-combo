import type { ReactNode } from "react";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/Breadcrumbs";
import { TableOfContents } from "@/components/TableOfContents";
import type { TocEntry } from "@/lib/toc";

type ArticleShellProps = {
  breadcrumbs: BreadcrumbItem[];
  toc: TocEntry[];
  tocLabel?: string;
  tocAccentClassName?: string;
  children: ReactNode;
};

export function ArticleShell({
  breadcrumbs,
  toc,
  tocLabel = "On this page",
  tocAccentClassName = "text-cyan-500/80",
  children,
}: ArticleShellProps) {
  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="min-w-0">
          <Breadcrumbs items={breadcrumbs} />

          <details className="motion-safe:open:shadow-none mt-6 rounded-xl border border-zinc-800/80 bg-zinc-950/50 lg:hidden">
            <summary className="cursor-pointer list-none px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wide text-zinc-300 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between">
                {tocLabel}
                <span className={tocAccentClassName} aria-hidden>
                  ↓
                </span>
              </span>
            </summary>
            <div className="border-t border-zinc-800/80 px-4 py-3">
              <TableOfContents items={toc} />
            </div>
          </details>

          {children}
        </div>

        <aside className="relative mt-10 hidden lg:mt-0 lg:block">
          <div className="sticky top-24 rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-5">
            <TableOfContents items={toc} />
          </div>
        </aside>
      </div>
    </article>
  );
}
