import Link from "next/link";

export type RelatedContentLink = {
  title: string;
  href: string;
  ariaLabel?: string;
};

export type RelatedContentGroup = {
  title?: string;
  links: RelatedContentLink[];
};

type RelatedContentPanelProps = {
  title: string;
  subtitle?: string;
  groups: RelatedContentGroup[];
  chipClassName?: string;
  linksWrapClassName?: string;
  groupLabelClassName?: string;
  groupsWrapClassName?: string;
};

export function RelatedContentPanel({
  title,
  subtitle,
  groups,
  chipClassName,
  linksWrapClassName,
  groupLabelClassName,
  groupsWrapClassName,
}: RelatedContentPanelProps) {
  const visibleGroups = groups.filter((group) => group.links.length > 0);
  if (visibleGroups.length === 0) return null;

  return (
    <aside className="mt-10 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6">
      <p className="text-sm font-semibold text-zinc-200">{title}</p>
      {subtitle ? (
        <p className="mt-2 text-sm leading-relaxed text-zinc-300">{subtitle}</p>
      ) : null}

      <div className={groupsWrapClassName ?? "mt-4 space-y-4"}>
        {visibleGroups.map((group) => (
          <section key={group.title ?? group.links[0]?.href}>
            {group.title ? (
              <p
                className={`mb-2 font-mono text-xs uppercase tracking-[0.1em] text-zinc-400 ${
                  groupLabelClassName ?? ""
                }`}
              >
                {group.title}
              </p>
            ) : null}
            <div className={linksWrapClassName ?? "flex flex-wrap gap-2"}>
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-label={link.ariaLabel}
                  className={`inline-flex items-center rounded-full border border-zinc-700/80 bg-zinc-950/45 px-3 py-1.5 text-sm text-zinc-200 transition-[border-color,background-color,color] duration-200 hover:border-cyan-400/35 hover:bg-cyan-500/[0.08] hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45 ${
                    chipClassName ?? ""
                  }`}
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
