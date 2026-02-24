import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Use this project as the root for file tracing (avoids parent-directory lockfile warning)
  outputFileTracingRoot: path.resolve(process.cwd()),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;

