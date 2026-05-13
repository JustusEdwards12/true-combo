export const SITE_NAME = "TrueCombo";

export const SITE_TAGLINE =
  "Competitive Super Smash Bros. Ultimate guides, character breakdowns, matchup advice, and improvement resources.";

const PREFERRED_SITE_URL = "https://www.truecombo.net";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? PREFERRED_SITE_URL;
  const normalizedInput = raw.startsWith("http://") || raw.startsWith("https://")
    ? raw
    : `https://${raw}`;

  try {
    const url = new URL(normalizedInput);
    const isTrueCombo = url.hostname === "truecombo.net" || url.hostname === "www.truecombo.net";

    if (isTrueCombo) {
      url.protocol = "https:";
      url.hostname = "www.truecombo.net";
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    return PREFERRED_SITE_URL;
  }
}
