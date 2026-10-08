import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — no server runtime needed. Deploys to Cloudflare Pages.
  output: "export",
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  trailingSlash: true,
  // No image optimizer route: all deployed assets must be static files.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
