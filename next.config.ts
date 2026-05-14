import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  async redirects() {
    return [
      {
        source: "/guides/best-oos-options",
        destination: "/guides/out-of-shield-options",
        permanent: true,
      },
      {
        source: "/guides/what-beginners-should-practice-first",
        destination: "/guides/beginner-practice-routine",
        permanent: true,
      },
      {
        source: "/guides/cloud-vs-joker-matchup-tips",
        destination: "/guides/cloud-vs-joker-matchup-guide",
        permanent: true,
      },
      {
        source: "/guides/mario-vs-samus-matchup-basics",
        destination: "/guides/mario-vs-samus-matchup-guide",
        permanent: true,
      },
      {
        source: "/matchups/matchup-adaptation-between-games",
        destination: "/matchups/set-adaptation-between-games",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "truecombo.net" }],
        destination: "https://www.truecombo.net/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
