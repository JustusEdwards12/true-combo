type DrillCardProps = {
  title: string;
  objective: string;
  setup: string;
  reps: string;
  successCheck: string;
};

export function DrillCard({
  title,
  objective,
  setup,
  reps,
  successCheck,
}: DrillCardProps) {
  return (
    <aside className="mt-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/35 p-5 sm:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/85">
        Drill Card
      </p>
      <h3 className="mt-2 text-base font-semibold text-zinc-100">{title}</h3>
      <dl className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-400">
        <div>
          <dt className="font-medium text-zinc-300">Objective</dt>
          <dd>{objective}</dd>
        </div>
        <div>
          <dt className="font-medium text-zinc-300">Setup</dt>
          <dd>{setup}</dd>
        </div>
        <div>
          <dt className="font-medium text-zinc-300">Reps</dt>
          <dd>{reps}</dd>
        </div>
        <div>
          <dt className="font-medium text-zinc-300">Success Check</dt>
          <dd>{successCheck}</dd>
        </div>
      </dl>
    </aside>
  );
}
