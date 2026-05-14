import Link from "next/link";
import type { ReactNode } from "react";
import { Rajdhani, Sora } from "next/font/google";

type LaneVisualVariant = "guides" | "characters" | "matchups" | "glossary";

const sora = Sora({ subsets: ["latin"], weight: ["600", "700"] });
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["500", "600"] });

const metaByVariant: Record<
  LaneVisualVariant,
  {
    kicker: string;
    lane: string;
    accent: string;
    metadata: string;
    cta: string;
    iconTone: string;
    iconFrame: string;
    glow: string;
    hoverBg: string;
    hoverBorder: string;
    hoverShadow: string;
    recommended?: boolean;
    baseCardTone?: string;
  }
> = {
  guides: {
    kicker: "Guides",
    lane: "Path 01",
    accent: "text-cyan-200/90",
    metadata: "Beginner fundamentals",
    cta: "Start Guides →",
    iconTone: "text-cyan-300/90",
    iconFrame:
      "border-cyan-400/25 bg-cyan-500/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
    glow: "group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.35)]",
    hoverBg: "hover:bg-cyan-500/[0.07]",
    hoverBorder: "group-hover:border-cyan-400/45",
    hoverShadow: "group-hover:shadow-[0_18px_36px_-22px_rgba(34,211,238,0.46)]",
    recommended: true,
    baseCardTone:
      "border-cyan-400/22 bg-zinc-900/42 shadow-[0_8px_22px_-16px_rgba(34,211,238,0.24),inset_0_1px_0_0_rgba(255,255,255,0.04)]",
  },
  characters: {
    kicker: "Characters",
    lane: "Path 02",
    accent: "text-violet-200/90",
    metadata: "Roster and fighter data",
    cta: "Explore Fighters →",
    iconTone: "text-violet-200/95",
    iconFrame:
      "border-violet-400/24 bg-violet-500/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
    glow: "group-hover:drop-shadow-[0_0_12px_rgba(167,139,250,0.32)]",
    hoverBg: "hover:bg-violet-500/[0.07]",
    hoverBorder: "group-hover:border-violet-400/38",
    hoverShadow: "group-hover:shadow-[0_16px_34px_-22px_rgba(167,139,250,0.36)]",
    baseCardTone:
      "border-violet-400/18 bg-zinc-900/41 shadow-[0_8px_22px_-16px_rgba(167,139,250,0.2),inset_0_1px_0_0_rgba(255,255,255,0.04)]",
  },
  matchups: {
    kicker: "Matchups",
    lane: "Path 03",
    accent: "text-blue-200/90",
    metadata: "Strategy and counterplay",
    cta: "Study Matchups →",
    iconTone: "text-blue-300/95",
    iconFrame:
      "border-blue-400/24 bg-blue-500/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
    glow: "group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.34)]",
    hoverBg: "hover:bg-blue-500/[0.07]",
    hoverBorder: "group-hover:border-blue-400/42",
    hoverShadow: "group-hover:shadow-[0_16px_34px_-22px_rgba(59,130,246,0.38)]",
    baseCardTone:
      "border-blue-400/18 bg-zinc-900/41 shadow-[0_8px_22px_-16px_rgba(59,130,246,0.2),inset_0_1px_0_0_rgba(255,255,255,0.04)]",
  },
  glossary: {
    kicker: "Glossary",
    lane: "Path 04",
    accent: "text-amber-200/90",
    metadata: "Terms and quick reference",
    cta: "Learn Terms →",
    iconTone: "text-amber-200/95",
    iconFrame:
      "border-amber-400/24 bg-amber-500/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
    glow: "group-hover:drop-shadow-[0_0_12px_rgba(245,158,11,0.28)]",
    hoverBg: "hover:bg-amber-500/[0.07]",
    hoverBorder: "group-hover:border-amber-400/34",
    hoverShadow: "group-hover:shadow-[0_16px_34px_-22px_rgba(245,158,11,0.33)]",
    baseCardTone:
      "border-amber-400/18 bg-zinc-900/41 shadow-[0_8px_22px_-16px_rgba(245,158,11,0.2),inset_0_1px_0_0_rgba(255,255,255,0.04)]",
  },
};

const iconByVariant: Record<LaneVisualVariant, ReactNode> = {
  guides: (
    <svg viewBox="0 0 132 62" className="h-11 w-full" aria-hidden>
      <rect x="8" y="10" width="50" height="42" rx="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <rect x="74" y="10" width="50" height="42" rx="5" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.75" />
      <path d="M66 14 V48" stroke="rgb(82 82 91)" strokeWidth="1.2" />
      <path d="M17 21 H48 M17 30 H48 M17 39 H40" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M83 21 H114 M83 30 H110 M83 39 H104" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.85" />
    </svg>
  ),
  characters: (
    <svg viewBox="0 0 132 62" className="h-11 w-full" aria-hidden>
      <rect x="10" y="12" width="34" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <rect x="49" y="12" width="34" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <rect x="88" y="12" width="34" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <rect x="10" y="34" width="34" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <rect x="49" y="34" width="34" height="18" rx="4" fill="rgb(167 139 250)" fillOpacity="0.2" stroke="rgb(196 181 253)" strokeWidth="1.3" />
      <rect x="88" y="34" width="34" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  matchups: (
    <svg viewBox="0 0 132 62" className="h-11 w-full" aria-hidden>
      <rect x="10" y="15" width="48" height="32" rx="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <rect x="74" y="15" width="48" height="32" rx="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <text x="30" y="34" className="fill-zinc-400" style={{ fontSize: "8px", fontFamily: "var(--font-geist-mono)" }}>
        A
      </text>
      <text x="94" y="34" className="fill-zinc-400" style={{ fontSize: "8px", fontFamily: "var(--font-geist-mono)" }}>
        B
      </text>
      <path d="M58 31 H72" stroke="rgb(103 232 249)" strokeWidth="1.8" />
      <path d="M68 27 L74 31 L68 35" fill="none" stroke="rgb(103 232 249)" strokeWidth="1.8" />
      <path d="M74 37 H58" stroke="rgb(103 232 249)" strokeWidth="1.5" opacity="0.8" />
      <path d="M64 33 L58 37 L64 41" fill="none" stroke="rgb(103 232 249)" strokeWidth="1.5" opacity="0.8" />
    </svg>
  ),
  glossary: (
    <svg viewBox="0 0 132 62" className="h-11 w-full" aria-hidden>
      <rect x="18" y="10" width="96" height="42" rx="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <rect x="18" y="10" width="20" height="42" rx="5" fill="rgb(245 158 11)" fillOpacity="0.16" />
      <path d="M46 22 H106 M46 31 H98 M46 40 H102" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="30" cy="31" r="3" fill="rgb(251 191 36)" />
    </svg>
  ),
};

type LaneVisualCardProps = {
  title: string;
  description: string;
  href: string;
  variant: LaneVisualVariant;
  stat: string;
};

export function LaneVisualCard({
  title,
  description,
  href,
  variant,
  stat,
}: LaneVisualCardProps) {
  const meta = metaByVariant[variant];

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-2xl border p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)] transition-[border-color,background-color,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45 ${meta.baseCardTone ?? "border-zinc-800/90 bg-zinc-900/40"} ${meta.hoverBg} ${meta.hoverBorder} ${meta.hoverShadow}`}
    >
      <span
        className={`pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-55 ${meta.accent}`}
        aria-hidden
      />
      <div className="relative">
        <div className="mb-1 flex items-center justify-between">
          <span className={`${rajdhani.className} text-xs uppercase tracking-[0.12em] ${meta.accent}`}>
            {meta.kicker}
          </span>
          <span className={`${rajdhani.className} text-xs uppercase tracking-[0.08em] text-zinc-500`}>
            {meta.lane}
          </span>
        </div>
        <p className={`${rajdhani.className} text-xs text-zinc-400`}>
          {meta.metadata}
        </p>
        <div
          className={`mt-1 rounded-lg border px-2.5 py-1 ${meta.iconFrame} ${meta.iconTone} transition-all duration-300 ${meta.glow}`}
        >
          {iconByVariant[variant]}
        </div>
        <p className={`${sora.className} mt-2 text-xl font-bold text-zinc-100`}>{title}</p>
        <p className="mt-1 text-base leading-relaxed text-zinc-300/90">{description}</p>
        <p className="mt-3 text-sm font-medium text-zinc-300">{stat}</p>
        <p className={`mt-3 text-sm font-semibold ${meta.accent}`}>
          {meta.cta}
        </p>
      </div>
    </Link>
  );
}
