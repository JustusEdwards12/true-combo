type TipCardProps = {
  title: string;
  body: string;
  tone?: "tip" | "warning" | "mistake";
};

const toneClass: Record<NonNullable<TipCardProps["tone"]>, string> = {
  tip: "border-cyan-500/35 bg-cyan-500/[0.07] text-zinc-300",
  warning: "border-amber-500/35 bg-amber-500/[0.07] text-zinc-300",
  mistake: "border-rose-500/35 bg-rose-500/[0.07] text-zinc-300",
};

export function TipCard({ title, body, tone = "tip" }: TipCardProps) {
  return (
    <aside className={`mt-6 rounded-2xl border p-5 sm:p-6 ${toneClass[tone]}`}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em]">
        {tone === "tip" ? "Coaching Tip" : tone === "warning" ? "Warning" : "Common Mistake"}
      </p>
      <h3 className="mt-2 text-base font-semibold text-zinc-100">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed">{body}</p>
    </aside>
  );
}
