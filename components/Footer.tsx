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
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-sm font-semibold text-zinc-200">{SITE_NAME}</p>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-zinc-500">
            Guides and resources for Super Smash Bros. Ultimate. Not affiliated
            with Nintendo.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-500">
          <Link href="/guides" className="hover:text-cyan-400">
            Guides
          </Link>
          <Link href="/guides#beginner" className="hover:text-cyan-400">
            Mechanics
          </Link>
          <Link href="/characters" className="hover:text-cyan-400">
            Characters
          </Link>
          <Link href="/matchups" className="hover:text-cyan-400">
            Matchups
          </Link>
          <Link href="/glossary" className="hover:text-cyan-400">
            Glossary
          </Link>
          <Link href="/" className="hover:text-cyan-400" rel="home">
            {host}
          </Link>
        </div>
      </div>
      <div className="border-t border-zinc-800/60 py-4 text-center text-[11px] text-zinc-600">
        © {year} {SITE_NAME}
      </div>
    </footer>
  );
}
