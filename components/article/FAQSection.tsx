export type FaqItem = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  items: FaqItem[];
};

export function FAQSection({ items }: FAQSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12 border-t border-zinc-800/80 pt-8" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-xl font-semibold tracking-tight text-zinc-100">
        FAQ
      </h2>
      <div className="mt-5 space-y-3">
        {items.map((faq) => (
          <details
            key={faq.question}
            className="rounded-xl border border-zinc-800/80 bg-zinc-900/35 px-4 py-3"
          >
            <summary className="cursor-pointer list-none text-sm font-semibold text-zinc-200 [&::-webkit-details-marker]:hidden">
              {faq.question}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
