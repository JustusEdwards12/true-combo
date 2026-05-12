"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComboMark } from "@/components/brand/ComboMark";

const nav = [
  { href: "/guides", label: "Guides" },
  { href: "/guides#beginner", label: "Mechanics" },
  { href: "/characters", label: "Characters" },
  { href: "/matchups", label: "Matchups" },
  { href: "/glossary", label: "Glossary" },
] as const;

function NavLink({ href, children }: { href: string; children: string }) {
  const pathname = usePathname();
  const hrefPath = href.split("#")[0] || "/";
  const active =
    hrefPath === "/"
      ? pathname === "/"
      : pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);

  return (
    <Link
      href={href}
      className={`group relative px-2.5 py-2 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
        active ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-200"
      }`}
    >
      <span>{children}</span>
      <span
        className={`pointer-events-none absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all duration-300 ease-out ${
          active
            ? "bg-gradient-to-r from-cyan-400 via-cyan-300 to-violet-400 opacity-100 shadow-[0_0_14px_rgba(34,211,238,0.45)]"
            : "scale-x-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/80 to-violet-400/0 opacity-0 group-hover:scale-x-100 group-hover:opacity-90"
        }`}
        aria-hidden
      />
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/75 shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset] backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3 text-zinc-100"
        >
          <ComboMark
            className="h-9 w-9 shrink-0 text-cyan-400/85 transition-all duration-300 group-hover:scale-[1.03] group-hover:text-cyan-300"
            aria-hidden
          />
          <div className="flex min-w-0 flex-col leading-none">
            <span className="font-mono text-[9px] font-medium uppercase tracking-[0.28em] text-zinc-600 transition-colors duration-300 group-hover:text-zinc-500">
              Smash Ultimate
            </span>
            <span className="mt-1.5 text-[15px] font-semibold tracking-[0.04em] text-zinc-50 transition-colors duration-300 group-hover:text-white sm:text-base">
              TrueCombo
            </span>
          </div>
        </Link>
        <nav
          className="flex shrink-0 items-center gap-0.5 sm:gap-1"
          aria-label="Main navigation"
        >
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
