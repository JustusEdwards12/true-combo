import type { ReactNode } from "react";

type MediaBoxProps = {
  children: ReactNode;
  caption?: string;
  label?: string;
  className?: string;
};

export function MediaBox({ children, caption, label, className }: MediaBoxProps) {
  return (
    <figure
      className={`mt-6 overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 ${
        className ?? ""
      }`}
    >
      <div className="relative">{children}</div>
      {label || caption ? (
        <figcaption className="border-t border-zinc-800/80 px-4 py-3 text-xs leading-relaxed text-zinc-400 sm:px-5">
          {label ? (
            <span className="mr-2 inline-flex rounded border border-cyan-500/25 bg-cyan-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-cyan-300">
              {label}
            </span>
          ) : null}
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
