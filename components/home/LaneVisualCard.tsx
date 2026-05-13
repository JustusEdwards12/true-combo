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
    metadata: "BEGINNER • FUNDAMENTALS",
    cta: "Start Guides →",
    iconTone: "text-cyan-300/90",
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
    metadata: "ROSTER • FIGHTER DATA",
    cta: "Explore Fighters →",
    iconTone: "text-violet-200/90",
    glow: "group-hover:drop-shadow-[0_0_12px_rgba(167,139,250,0.32)]",
    hoverBg: "hover:bg-cyan-500/[0.07]",
    hoverBorder: "group-hover:border-violet-400/38",
    hoverShadow: "group-hover:shadow-[0_16px_34px_-22px_rgba(167,139,250,0.36)]",
  },
  matchups: {
    kicker: "Matchups",
    lane: "Path 03",
    accent: "text-blue-200/90",
    metadata: "STRATEGY • COUNTERPLAY",
    cta: "Study Matchups →",
    iconTone: "text-blue-300/90",
    glow: "group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.34)]",
    hoverBg: "hover:bg-cyan-500/[0.07]",
    hoverBorder: "group-hover:border-blue-400/42",
    hoverShadow: "group-hover:shadow-[0_16px_34px_-22px_rgba(59,130,246,0.38)]",
  },
  glossary: {
    kicker: "Glossary",
    lane: "Path 04",
    accent: "text-amber-200/90",
    metadata: "TERMS • QUICK REFERENCE",
    cta: "Learn Terms →",
    iconTone: "text-amber-200/85",
    glow: "group-hover:drop-shadow-[0_0_12px_rgba(245,158,11,0.28)]",
    hoverBg: "hover:bg-cyan-500/[0.07]",
    hoverBorder: "group-hover:border-amber-400/34",
    hoverShadow: "group-hover:shadow-[0_16px_34px_-22px_rgba(245,158,11,0.33)]",
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
      <rect x="49" y="34" width="34" height="18" rx="4" fill="rgb(34 211 238)" fillOpacity="0.18" stroke="rgb(103 232 249)" strokeWidth="1.3" />
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
      <rect x="18" y="10" width="20" height="42" rx="5" fill="rgb(34 211 238)" fillOpacity="0.14" />
      <path d="M46 22 H106 M46 31 H98 M46 40 H102" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="30" cy="31" r="3" fill="rgb(103 232 249)" />
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
      className={`group relative overflow-hidden rounded-2xl border p-3.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)] transition-[transform,border-color,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:hover:-translate-y-1 ${meta.recommended ? meta.baseCardTone : "border-zinc-800/90 bg-zinc-900/40"} ${meta.hoverBg} ${meta.hoverBorder} ${meta.hoverShadow}`}
    >
      <span
        className={`pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-55 ${meta.accent}`}
        aria-hidden
      />
      <div className="relative">
        <div className="mb-1 flex items-center justify-between">
          <span className={`${rajdhani.className} text-[11px] uppercase tracking-[0.18em] ${meta.accent}`}>
            {meta.kicker}
          </span>
          <span className={`${rajdhani.className} text-[10px] uppercase tracking-[0.14em] text-zinc-600`}>
            {meta.lane}
          </span>
        </div>
        <p className={`${rajdhani.className} text-[10px] uppercase tracking-[0.2em] text-zinc-500`}>
          {meta.metadata}
        </p>
        <div className={`mt-1 ${meta.iconTone} transition-all duration-300 ${meta.glow}`}>
          {iconByVariant[variant]}
        </div>
        {meta.recommended ? (
          <span
            className={`${rajdhani.className} mt-1 inline-flex items-center rounded-full border border-cyan-400/24 bg-cyan-500/[0.06] px-1.5 py-[1px] text-[9px] font-semibold uppercase tracking-[0.15em] text-cyan-200/85 shadow-[0_0_10px_-6px_rgba(34,211,238,0.22)]`}
          >
            Start Here
          </span>
        ) : null}
        <p className={`${sora.className} mt-1 text-[17px] font-bold text-zinc-100`}>{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-zinc-500">{description}</p>
        <p className="mt-3 text-[11px] font-medium text-zinc-400">{stat}</p>
        <p className={`mt-3 text-xs font-semibold ${meta.accent}`}>
          {meta.cta}
        </p>
      </div>
    </Link>
  );
}
