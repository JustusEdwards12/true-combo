import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const metadata = buildMetadata({
  title: "About TrueCombo - Smash Ultimate Learning Platform",
  description: `${SITE_NAME} is a competitive Smash Ultimate learning platform with practical guides, matchup strategy, and glossary-backed coaching built for faster improvement.`,
  path: "/about",
  keywords: [
    "Smash Ultimate learning platform",
    "competitive Smash Ultimate guides",
    "Smash Ultimate improvement",
  ],
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-50">
        About {SITE_NAME}
      </h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-400 sm:text-base">
        <p>{SITE_TAGLINE}</p>
        <p>
          We focus on tight explanations, honest character notes, and matchup
          thinking you can apply in tournament sets—not tier list theater or
          clickbait patches.
        </p>
        <p>
          Content is authored as Markdown in the repo, versioned like code, and
          shipped as static pages for fast loads and simple publishing.
        </p>
        <p>
          Start with{" "}
          <Link href="/guides" className="text-cyan-400 hover:underline">
            guides
          </Link>
          , browse{" "}
          <Link href="/characters" className="text-cyan-400 hover:underline">
            characters
          </Link>
          , or jump into{" "}
          <Link href="/glossary" className="text-cyan-400 hover:underline">
            glossary terms
          </Link>{" "}
          when commentary gets jargon-heavy.
        </p>
      </div>
    </div>
  );
}
