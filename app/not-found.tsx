import type { Metadata } from "next";
import Link from "next/link";
import { buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: buildPageTitle("Page not found"),
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-medium text-cyan-500">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">
        Page not found
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-500">
        That route is not in the patch notes. Head back and pick a different
        option.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-10 items-center justify-center rounded-lg bg-cyan-500 px-5 text-sm font-semibold text-zinc-950 hover:bg-cyan-400"
      >
        Back to home
      </Link>
    </div>
  );
}
