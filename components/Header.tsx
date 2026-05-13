"use client";

import Link from "next/link";
import { Sora } from "next/font/google";
import { usePathname } from "next/navigation";
import { ComboMark } from "@/components/brand/ComboMark";

const sora = Sora({
  subsets: ["latin"],
  weight: ["700", "800"],
});

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
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/78 shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset] backdrop-blur-xl backdrop-saturate-150">
      <div className="relative mx-auto flex h-14 max-w-6xl items-center px-4 sm:h-[58px] sm:px-6">
        <nav
          className="ml-auto flex min-w-0 items-center justify-end gap-0.5 pl-[156px] sm:gap-1 sm:pl-[176px]"
          aria-label="Main navigation"
        >
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link
          href="/"
          className="group absolute left-4 top-1/2 flex -translate-y-1/2 items-center rounded-xl border border-zinc-700/70 bg-zinc-950/70 px-3 py-1.5 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(255,255,255,0.045)] transition-[border-color,box-shadow,background-color,transform] duration-300 hover:border-cyan-400/35 hover:bg-zinc-900/70 hover:shadow-[0_12px_28px_-14px_rgba(34,211,238,0.25),inset_0_1px_0_0_rgba(255,255,255,0.06)] motion-safe:hover:-translate-y-[calc(50%+2px)] sm:left-6"
        >
          <div className="relative mr-2.5">
            <span
              className="pointer-events-none absolute inset-0 rounded-full bg-cyan-400/35 blur-md transition-opacity duration-300 group-hover:opacity-100 opacity-70"
              aria-hidden
            />
            <ComboMark
              className="relative h-7 w-7 shrink-0 text-cyan-300/95 transition-all duration-300 group-hover:text-cyan-200"
              aria-hidden
            />
          </div>
          <div className="flex min-w-0 flex-col leading-none">
            <span
              className={`${sora.className} text-[16px] font-extrabold tracking-[0.02em] text-zinc-50 transition-colors duration-300 group-hover:text-white sm:text-[17px]`}
            >
              TrueCombo
            </span>
            <span className="mt-1 font-mono text-[8px] font-medium uppercase tracking-[0.28em] text-zinc-500/85 transition-colors duration-300 group-hover:text-zinc-400/90">
              SMASH ULTIMATE
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
