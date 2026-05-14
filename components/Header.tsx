"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Chakra_Petch } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { ComboMark } from "@/components/brand/ComboMark";

/** Display face for the TrueCombo wordmark — geometric, reads well small in the header bar */
const brandWordmark = Chakra_Petch({
  subsets: ["latin"],
  weight: ["700"],
});

const nav = [
  { href: "/guides", label: "Guides" },
  { href: "/characters", label: "Characters" },
  { href: "/matchups", label: "Matchups" },
  { href: "/glossary", label: "Glossary" },
] as const;

function NavLink({
  href,
  children,
  pathname,
  hash = "",
  onNavigate,
  mobile = false,
}: {
  href: string;
  children: string;
  pathname: string;
  hash?: string;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  const hrefPath = href.split("#")[0] || "/";
  const hrefHash = href.includes("#") ? `#${href.split("#")[1]}` : "";

  const hasSectionNavForPath = nav.some(
    (item) => item.href.startsWith(`${hrefPath}#`),
  );
  const sectionActive =
    hrefHash.length > 0 && pathname === hrefPath && hash === hrefHash;
  const active =
    sectionActive ||
    (hrefPath === "/"
      ? pathname === "/"
      : hrefHash.length > 0
        ? false
        : pathname.startsWith(`${hrefPath}/`) ||
          (pathname === hrefPath &&
            !(hasSectionNavForPath && hash.length > 0)));

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`group relative rounded-lg px-2.5 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45 ${
        mobile ? "text-sm" : "text-xs sm:px-3 sm:text-sm"
      } ${
        active
          ? "text-zinc-100"
          : "text-zinc-400 hover:text-zinc-100 focus-visible:text-zinc-100"
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

function BrandHomeLink({
  variant,
  className = "",
}: {
  variant: "compact" | "full";
  className?: string;
}) {
  const compact = variant === "compact";

  return (
    <Link
      href="/"
      className={[
        "group inline-flex max-w-[min(100%,18rem)] items-center rounded-xl transition-[background-color,color,box-shadow] duration-200",
        "hover:bg-white/[0.035] active:bg-white/[0.055]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        compact ? "gap-2 px-1 py-1" : "gap-3 px-1.5 py-1",
        className,
      ].join(" ")}
    >
      <span
        className={[
          "relative flex shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-b from-zinc-800/95 to-zinc-950 ring-1 ring-inset ring-white/[0.08] transition-[box-shadow,ring-color] duration-300",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07)]",
          "group-hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.09),0_0_24px_-10px_rgba(34,211,238,0.28)] group-hover:ring-cyan-400/25",
          compact ? "p-1.5" : "p-2",
        ].join(" ")}
        aria-hidden
      >
        <ComboMark
          className={[
            "relative shrink-0 text-cyan-300/95 transition-colors duration-300 group-hover:text-cyan-200",
            compact ? "h-6 w-6" : "h-[26px] w-[26px] sm:h-7 sm:w-7",
          ].join(" ")}
          aria-hidden
        />
      </span>
      <div className="flex min-w-0 flex-col leading-none">
        <span
          className={[
            `${brandWordmark.className} truncate tracking-[0.06em] text-zinc-50 transition-colors duration-200 group-hover:text-white`,
            compact ? "text-[14px]" : "text-[15px] sm:text-[16px]",
          ].join(" ")}
        >
          TrueCombo
        </span>
        {!compact ? (
          <span className="mt-1 font-mono text-xs font-medium uppercase tracking-[0.14em] text-zinc-500 transition-colors duration-200 group-hover:text-zinc-400">
            Smash Ultimate
          </span>
        ) : null}
      </div>
    </Link>
  );
}

function HeaderGuideSearch({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable;
      if (isTypingTarget) return;

      if (!inputRef.current) return;
      event.preventDefault();
      inputRef.current.focus();
      inputRef.current.select();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      router.push("/search");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearchSubmit} className="hidden sm:block">
      <label htmlFor="header-guide-search" className="sr-only">
        Search site
      </label>
      <div className="flex items-center gap-1.5 rounded-lg border border-zinc-700/70 bg-zinc-900/55 px-2 py-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
        <input
          id="header-guide-search"
          ref={inputRef}
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search site..."
          title="Press / to focus search"
          className="w-36 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none lg:w-44"
        />
        <kbd
          className="hidden rounded border border-zinc-700/80 bg-zinc-950/70 px-1.5 py-0.5 font-mono text-xs text-zinc-500 lg:inline"
          aria-label="Press slash to focus search"
        >
          /
        </kbd>
        <button
          type="submit"
          className="rounded border border-zinc-700/80 bg-zinc-950/60 px-2 py-0.5 text-xs font-semibold text-zinc-300 transition-colors hover:border-cyan-400/35 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
        >
          Go
        </button>
      </div>
    </form>
  );
}

export function Header() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash || "");
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/78 shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset] backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:max-w-[88rem]">
        <div className="flex h-14 items-center justify-between sm:hidden">
          <BrandHomeLink variant="compact" />
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg border border-zinc-700/80 bg-zinc-950/60 px-2.5 py-1 text-xs font-semibold text-zinc-300 transition-colors hover:border-cyan-400/35 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
            >
              Search
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-main-nav"
              className="rounded-lg border border-zinc-700/80 bg-zinc-950/60 px-2.5 py-1 text-xs font-semibold text-zinc-300 transition-colors hover:border-cyan-400/35 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
            >
              Menu
            </button>
          </div>
        </div>
        {mobileMenuOpen ? (
          <nav
            id="mobile-main-nav"
            className="grid grid-cols-2 gap-1 border-t border-zinc-800/80 py-2 sm:hidden"
            aria-label="Main navigation"
          >
            {nav.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                pathname={pathname}
                hash={hash}
                onNavigate={() => setMobileMenuOpen(false)}
                mobile
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        ) : null}

        <div className="relative hidden h-[58px] items-center sm:flex">
          <div className="ml-auto flex min-w-0 items-center justify-end gap-3 pl-[188px]">
            <nav
              className="flex min-w-0 items-center justify-end gap-1"
              aria-label="Main navigation"
            >
              {nav.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  pathname={pathname}
                  hash={hash}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <HeaderGuideSearch initialQuery="" />
          </div>
          <BrandHomeLink
            variant="full"
            className="absolute left-6 top-1/2 -translate-y-1/2"
          />
        </div>
      </div>
    </header>
  );
}
