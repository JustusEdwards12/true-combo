export function ImprovementPathGraphic() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/45 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)] sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent" />

      <p className="font-mono text-xs uppercase tracking-[0.14em] text-zinc-400">
        Neutral game flow
      </p>
      <p className="mt-2 text-base text-zinc-300">
        Neutral {"->"} opening {"->"} advantage.
      </p>

      <div className="relative mt-6 rounded-xl border border-zinc-800/80 bg-zinc-900/35 p-4">
        <svg
          viewBox="0 0 420 132"
          className="h-[132px] w-full sm:h-[148px]"
          role="img"
          aria-label="Simple neutral to advantage flow"
        >
          <rect x="14" y="50" width="392" height="46" rx="10" fill="rgb(24 24 27)" />
          <circle cx="104" cy="73" r="8" fill="rgb(125 211 252)" />
          <circle cx="188" cy="73" r="6.6" fill="rgb(56 189 248)" fillOpacity="0.95" />
          <circle cx="284" cy="73" r="6.6" fill="rgb(56 189 248)" fillOpacity="0.95" />
          <circle cx="354" cy="73" r="8.5" fill="rgb(34 211 238)" />

          <path d="M118 73 H174" stroke="rgb(103 232 249)" strokeWidth="2.2" />
          <path d="M202 73 H270" stroke="rgb(103 232 249)" strokeWidth="2.2" />
          <path d="M298 73 H340" stroke="rgb(103 232 249)" strokeWidth="2.2" />

          <text x="82" y="28" className="fill-zinc-400" style={{ fontSize: "10px", fontFamily: "var(--font-geist-mono)" }}>
            NEUTRAL
          </text>
          <text x="166" y="28" className="fill-zinc-500" style={{ fontSize: "10px", fontFamily: "var(--font-geist-mono)" }}>
            OPENING
          </text>
          <text x="260" y="28" className="fill-zinc-500" style={{ fontSize: "10px", fontFamily: "var(--font-geist-mono)" }}>
            PUNISH
          </text>
          <text x="330" y="28" className="fill-cyan-300/85" style={{ fontSize: "10px", fontFamily: "var(--font-geist-mono)" }}>
            ADVANTAGE
          </text>
        </svg>
      </div>
    </div>
  );
}
