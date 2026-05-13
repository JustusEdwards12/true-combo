import ReactMarkdown from "react-markdown";
import type { ReactNode } from "react";
import remarkGfm from "remark-gfm";
import { ComparisonPanel } from "@/components/guide-media/ComparisonPanel";
import { DrillCard } from "@/components/guide-media/DrillCard";
import { GuideGif } from "@/components/guide-media/GuideGif";
import { GuideImage } from "@/components/guide-media/GuideImage";
import { TipCard } from "@/components/guide-media/TipCard";
import { plainTextFromNode } from "@/lib/plain-text";
import { slugifyHeading } from "@/lib/slugify";
import type { TocEntry } from "@/lib/toc";

type MarkdownContentProps = {
  content: string;
  className?: string;
  /** When provided, heading `id`s align with the table of contents. */
  toc?: TocEntry[];
};

function calloutKind(text: string): "tip" | "note" | "warn" | null {
  const t = text.trim();
  if (/^tip:/i.test(t)) return "tip";
  if (/^note:/i.test(t)) return "note";
  if (/^warning:/i.test(t)) return "warn";
  return null;
}

function calloutClass(kind: "tip" | "note" | "warn"): string {
  switch (kind) {
    case "tip":
      return "border-cyan-500/35 bg-cyan-500/[0.06] text-zinc-300";
    case "note":
      return "border-zinc-600/80 bg-zinc-900/40 text-zinc-400";
    case "warn":
      return "border-amber-500/35 bg-amber-500/[0.06] text-zinc-300";
    default:
      return "";
  }
}

type ParsedDirective =
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "gif"; src: string; alt?: string; caption?: string }
  | {
      type: "comparison";
      title: string;
      leftLabel: string;
      leftSrc: string;
      rightLabel: string;
      rightSrc: string;
      caption?: string;
    }
  | {
      type: "drill";
      title: string;
      objective: string;
      setup: string;
      reps: string;
      successCheck: string;
    }
  | { type: "tip-card"; tone: "tip" | "warning" | "mistake"; title: string; body: string };

function parseParts(raw: string): string[] {
  return raw
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean);
}

function parseDirective(raw: string): ParsedDirective | null {
  const text = raw.trim();
  const image = text.match(/^guide-image:\s*(.+)$/i);
  if (image) {
    const [src = "", alt = "Guide image", caption = ""] = parseParts(image[1]);
    if (!src) return null;
    return { type: "image", src, alt, caption: caption || undefined };
  }

  const gif = text.match(/^guide-(gif|video):\s*(.+)$/i);
  if (gif) {
    const [src = "", alt = "Guide clip", caption = ""] = parseParts(gif[2]);
    if (!src) return null;
    return { type: "gif", src, alt, caption: caption || undefined };
  }

  const compare = text.match(/^comparison:\s*(.+)$/i);
  if (compare) {
    const parts = parseParts(compare[1]);
    if (parts.length < 5) return null;
    const [title, leftLabel, leftSrc, rightLabel, rightSrc, caption = ""] = parts;
    if (!title || !leftLabel || !leftSrc || !rightLabel || !rightSrc) return null;
    return {
      type: "comparison",
      title,
      leftLabel,
      leftSrc,
      rightLabel,
      rightSrc,
      caption: caption || undefined,
    };
  }

  const drill = text.match(/^drill-card:\s*(.+)$/i);
  if (drill) {
    const parts = parseParts(drill[1]);
    if (parts.length < 5) return null;
    const [title, objective, setup, reps, successCheck] = parts;
    return {
      type: "drill",
      title,
      objective,
      setup,
      reps,
      successCheck,
    };
  }

  const tipCard = text.match(/^tip-card:\s*(.+)$/i);
  if (tipCard) {
    const parts = parseParts(tipCard[1]);
    if (parts.length < 2) return null;
    const maybeTone = parts[0].toLowerCase();
    if (maybeTone === "tip" || maybeTone === "warning" || maybeTone === "mistake") {
      const [, title, ...bodyParts] = parts;
      if (!title) return null;
      return {
        type: "tip-card",
        tone: maybeTone,
        title,
        body: bodyParts.join(" | ") || title,
      };
    }
    const [title, ...bodyParts] = parts;
    return {
      type: "tip-card",
      tone: "tip",
      title,
      body: bodyParts.join(" | ") || title,
    };
  }

  return null;
}

export function MarkdownContent({ content, className, toc }: MarkdownContentProps) {
  let hi = 0;
  const nextHeadingId = (level: 2 | 3, children: ReactNode) => {
    const text = plainTextFromNode(children);
    if (toc && hi < toc.length) {
      const e = toc[hi];
      if (e.level === level) {
        hi++;
        return e.id;
      }
    }
    return slugifyHeading(text);
  };

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              className="text-cyan-400 underline decoration-cyan-500/40 underline-offset-2 transition-colors hover:text-cyan-300 hover:decoration-cyan-400"
              {...props}
            >
              {children}
            </a>
          ),
          h2: ({ children, ...props }) => {
            const id = nextHeadingId(2, children);
            return (
              <h2
                id={id}
                className="mt-10 scroll-mt-28 text-xl font-semibold tracking-tight text-zinc-100 first:mt-0"
                {...props}
              >
                {children}
              </h2>
            );
          },
          h3: ({ children, ...props }) => {
            const id = nextHeadingId(3, children);
            return (
              <h3
                id={id}
                className="mt-8 scroll-mt-28 text-lg font-semibold text-zinc-200"
                {...props}
              >
                {children}
              </h3>
            );
          },
          p: ({ children, ...props }) => (
            <p
              className="mt-4 leading-relaxed text-zinc-400 first:mt-0"
              {...props}
            >
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul
              className="mt-4 list-disc space-y-2 pl-5 text-zinc-400"
              {...props}
            >
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol
              className="mt-4 list-decimal space-y-2 pl-5 text-zinc-400"
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="leading-relaxed" {...props}>
              {children}
            </li>
          ),
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-zinc-200" {...props}>
              {children}
            </strong>
          ),
          code: ({ className: codeClass, children, ...props }) => {
            const inline = !codeClass;
            if (inline) {
              return (
                <code
                  className="rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-sm text-cyan-200"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={codeClass} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children, ...props }) => (
            <pre
              className="mt-4 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300"
              {...props}
            >
              {children}
            </pre>
          ),
          blockquote: ({ children, ...props }) => {
            const raw = plainTextFromNode(children);
            const directive = parseDirective(raw);
            if (directive) {
              if (directive.type === "image") {
                return (
                  <GuideImage
                    src={directive.src}
                    alt={directive.alt}
                    caption={directive.caption}
                  />
                );
              }
              if (directive.type === "gif") {
                return (
                  <GuideGif
                    src={directive.src}
                    alt={directive.alt}
                    caption={directive.caption}
                  />
                );
              }
              if (directive.type === "comparison") {
                return (
                  <ComparisonPanel
                    title={directive.title}
                    leftLabel={directive.leftLabel}
                    leftSrc={directive.leftSrc}
                    rightLabel={directive.rightLabel}
                    rightSrc={directive.rightSrc}
                    caption={directive.caption}
                  />
                );
              }
              if (directive.type === "drill") {
                return (
                  <DrillCard
                    title={directive.title}
                    objective={directive.objective}
                    setup={directive.setup}
                    reps={directive.reps}
                    successCheck={directive.successCheck}
                  />
                );
              }
              return (
                <TipCard
                  tone={directive.tone}
                  title={directive.title}
                  body={directive.body}
                />
              );
            }

            const kind = calloutKind(raw);
            if (kind) {
              return (
                <aside
                  className={`mt-6 rounded-xl border px-4 py-3 text-sm leading-relaxed [&_strong]:text-zinc-100 ${calloutClass(kind)}`}
                  {...props}
                >
                  <div className="[&_p]:mt-2 [&_p:first-child]:mt-0 [&_p:first-child]:font-medium">
                    {children}
                  </div>
                </aside>
              );
            }
            return (
              <blockquote
                className="mt-4 border-l-2 border-cyan-500/50 pl-4 italic text-zinc-500"
                {...props}
              >
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
