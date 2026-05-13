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
        source: "/:path*",
        has: [{ type: "host", value: "truecombo.net" }],
        destination: "https://www.truecombo.net/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
