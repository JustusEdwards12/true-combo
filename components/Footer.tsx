import Link from "next/link";
import { getSiteUrl, SITE_NAME } from "@/lib/site";

function siteHostname(): string {
  try {
    return new URL(getSiteUrl()).hostname;
  } catch {
    return "truecombo.net";
  }
}

export function Footer() {
  const year = new Date().getFullYear();
  const host = siteHostname();
  return (
    <footer className="mt-auto border-t border-zinc-800/80 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 xl:max-w-[88rem]">
        <div>
          <p className="text-base font-semibold text-zinc-100">{SITE_NAME}</p>
          <p className="mt-1 max-w-sm text-sm leading-relaxed text-zinc-300">
            Guides and resources for Super Smash Bros. Ultimate. Not affiliated
            with Nintendo.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-300">
          <Link
            href="/guides"
            className="rounded-sm transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
          >
            Guides
          </Link>
          <Link
            href="/guides#beginner"
            className="rounded-sm transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
          >
            Mechanics
          </Link>
          <Link
            href="/characters"
            className="rounded-sm transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
          >
            Characters
          </Link>
          <Link
            href="/matchups"
            className="rounded-sm transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
          >
            Matchups
          </Link>
          <Link
            href="/glossary"
            className="rounded-sm transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
          >
            Glossary
          </Link>
          <Link
            href="/"
            className="rounded-sm transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
            rel="home"
          >
            {host}
          </Link>
        </div>
      </div>
      <div className="border-t border-zinc-800/60 py-4 text-center text-xs text-zinc-500">
        © {year} {SITE_NAME}
      </div>
    </footer>
  );
}
