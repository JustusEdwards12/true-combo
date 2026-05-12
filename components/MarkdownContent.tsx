import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

export function MarkdownContent({ content, className }: MarkdownContentProps) {
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
          h2: ({ children, ...props }) => (
            <h2
              className="mt-10 scroll-mt-24 text-xl font-semibold tracking-tight text-zinc-100 first:mt-0"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="mt-8 text-lg font-semibold text-zinc-200"
              {...props}
            >
              {children}
            </h3>
          ),
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
          code: ({ className, children, ...props }) => {
            const inline = !className;
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
              <code className={className} {...props}>
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
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="mt-4 border-l-2 border-cyan-500/50 pl-4 italic text-zinc-500"
              {...props}
            >
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
