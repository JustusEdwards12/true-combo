"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/guides", label: "Guides" },
  { href: "/characters", label: "Characters" },
  { href: "/matchups", label: "Matchups" },
  { href: "/glossary", label: "Glossary" },
  { href: "/about", label: "About" },
] as const;

function NavLink({ href, children }: { href: string; children: string }) {
  const pathname = usePathname();
  const active =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`group relative px-2.5 py-2 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
        active
          ? "text-zinc-100"
          : "text-zinc-500 hover:text-zinc-200"
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
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-100"
        >
          <span
            className="font-mono text-[10px] text-zinc-600 transition-colors group-hover:text-cyan-500/80"
            aria-hidden
          >
            [
          </span>
          <span className="transition-colors group-hover:text-cyan-50">
            TrueCombo
          </span>
          <span
            className="font-mono text-[10px] text-zinc-600 transition-colors group-hover:text-cyan-500/80"
            aria-hidden
          >
            ]
          </span>
          <span
            className="ml-0.5 h-1.5 w-1.5 rounded-full bg-cyan-400/90 shadow-[0_0_10px_rgba(34,211,238,0.6)]"
            aria-hidden
          />
        </Link>
        <nav
          className="flex items-center gap-0.5 sm:gap-1"
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
