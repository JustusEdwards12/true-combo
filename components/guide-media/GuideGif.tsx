import { MediaBox } from "@/components/guide-media/MediaBox";

type GuideGifProps = {
  src: string;
  alt?: string;
  caption?: string;
  className?: string;
};

function isVideoLike(src: string): boolean {
  return /\.(mp4|webm|ogg)$/i.test(src);
}

export function GuideGif({ src, alt = "Guide clip", caption, className }: GuideGifProps) {
  return (
    <MediaBox label="Clip" caption={caption} className={className}>
      {isVideoLike(src) ? (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-auto w-full object-cover"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-auto w-full object-cover"
        />
      )}
    </MediaBox>
  );
}
