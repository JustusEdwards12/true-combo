import type { TocEntry } from "@/lib/toc";

type TableOfContentsProps = {
  items: TocEntry[];
  /** Extra class on nav (e.g. sticky desktop aside) */
  className?: string;
};

export function TableOfContents({ items, className = "" }: TableOfContentsProps) {
  if (items.length === 0) return null;

  return (
    <nav
      className={className}
      aria-label="On this page"
    >
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
        On this page
      </p>
      <ol className="mt-4 space-y-2 border-l border-zinc-800/90 pl-3">
        {items.map((item) => (
          <li
            key={item.id}
            className={item.level === 3 ? "ml-3" : ""}
          >
            <a
              href={`#${item.id}`}
              className="block text-left text-xs leading-snug text-zinc-500 transition-colors hover:text-cyan-400"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
