import { MediaBox } from "@/components/guide-media/MediaBox";

type ComparisonPanelProps = {
  title: string;
  leftLabel: string;
  leftSrc: string;
  rightLabel: string;
  rightSrc: string;
  caption?: string;
};

function renderMedia(src: string, alt: string) {
  if (/\.(mp4|webm|ogg)$/i.test(src)) {
    return (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="h-40 w-full rounded-lg object-cover sm:h-48"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="h-40 w-full rounded-lg object-cover sm:h-48"
    />
  );
}

export function ComparisonPanel({
  title,
  leftLabel,
  leftSrc,
  rightLabel,
  rightSrc,
  caption,
}: ComparisonPanelProps) {
  return (
    <MediaBox label="Comparison" caption={caption}>
      <div className="space-y-4 px-4 py-4 sm:px-5">
        <p className="text-sm font-semibold text-zinc-200">{title}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-2">
            <p className="mb-2 text-xs font-medium text-zinc-400">{leftLabel}</p>
            {renderMedia(leftSrc, leftLabel)}
          </div>
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-2">
            <p className="mb-2 text-xs font-medium text-zinc-400">{rightLabel}</p>
            {renderMedia(rightSrc, rightLabel)}
          </div>
        </div>
      </div>
    </MediaBox>
  );
}
