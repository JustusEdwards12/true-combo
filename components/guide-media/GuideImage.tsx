import { MediaBox } from "@/components/guide-media/MediaBox";

type GuideImageProps = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
};

export function GuideImage({ src, alt, caption, className }: GuideImageProps) {
  return (
    <MediaBox label="Image" caption={caption} className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-auto w-full object-cover"
      />
    </MediaBox>
  );
}
