"use client";

import { useEffect, useMemo, useState } from "react";

type RotatingHeadlineWordProps = {
  words: string[];
  typingMs?: number;
  deletingMs?: number;
  holdMs?: number;
};

export function RotatingHeadlineWord({
  words,
  typingMs = 82,
  deletingMs = 46,
  holdMs = 1350,
}: RotatingHeadlineWordProps) {
  const safeWords = useMemo(
    () => (words.length > 0 ? words : ["true combo"]),
    [words],
  );
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState(safeWords[0]);
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("holding");

  useEffect(() => {
    const currentWord = safeWords[wordIndex % safeWords.length];

    if (phase === "holding") {
      const timer = window.setTimeout(() => setPhase("deleting"), holdMs);
      return () => window.clearTimeout(timer);
    }

    const nextDelay = phase === "typing" ? typingMs : deletingMs;
    const timer = window.setTimeout(() => {
      if (phase === "typing") {
        const next = currentWord.slice(0, text.length + 1);
        setText(next);
        if (next === currentWord) setPhase("holding");
        return;
      }

      const next = currentWord.slice(0, Math.max(0, text.length - 1));
      setText(next);
      if (next.length === 0) {
        setWordIndex((prev) => (prev + 1) % safeWords.length);
        setPhase("typing");
      }
    }, nextDelay);

    return () => window.clearTimeout(timer);
  }, [deletingMs, holdMs, phase, safeWords, text.length, typingMs, wordIndex]);

  return (
    <span className="inline-flex items-baseline text-cyan-300">{text || "\u00A0"}</span>
  );
}
