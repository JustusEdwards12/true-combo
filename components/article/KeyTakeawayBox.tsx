type KeyTakeawayBoxProps = {
  title?: string;
  items: string[];
};

export function KeyTakeawayBox({
  title = "Key Takeaways",
  items,
}: KeyTakeawayBoxProps) {
  if (items.length === 0) return null;

  return (
    <aside className="mt-8 rounded-2xl border border-cyan-500/25 bg-cyan-500/[0.06] p-5 sm:p-6">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-cyan-300/90">
        {title}
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-300">
        {items.map((item, i) => (
          <li key={`${item}-${i}`}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}
