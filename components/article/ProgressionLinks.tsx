import Link from "next/link";

export type ProgressionLink = {
  title: string;
  href: string;
  label: string;
};

type ProgressionLinksProps = {
  title: string;
  subtitle: string;
  links: ProgressionLink[];
};

export function ProgressionLinks({ title, subtitle, links }: ProgressionLinksProps) {
  if (links.length === 0) return null;

  return (
    <aside className="mt-10 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6">
      <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-300">{subtitle}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="group flex items-center justify-between rounded-lg border border-zinc-800/80 bg-zinc-950/40 px-3 py-2.5 text-sm text-zinc-200 transition-colors hover:border-cyan-500/35 hover:bg-cyan-500/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
            >
              <span>{link.title}</span>
              <span className="font-mono text-xs uppercase tracking-[0.1em] text-zinc-400 transition-colors group-hover:text-cyan-300/80">
                {link.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
