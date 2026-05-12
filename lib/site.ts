export const SITE_NAME = "TrueCombo";

export const SITE_TAGLINE =
  "Competitive Super Smash Bros. Ultimate guides, character breakdowns, matchup advice, and improvement resources.";

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://truecombo.net";
}
