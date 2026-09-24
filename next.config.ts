import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — no server runtime needed. Deploys to any static host.
  output: "export",

  // Smaller, faster responses and no framework fingerprinting.
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // Strip console output from production bundles (keep errors for diagnostics).
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },

  // Trailing slashes for static hosting compatibility.
  trailingSlash: true,

  // Images must be unoptimized for static export (no server-side image optimization).
  images: {
    unoptimized: true,
  },

  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];

    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/ads.txt",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
      {
        source: "/sitemap.xml",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400" }],
      },
    ];
  },
};

export default nextConfig;
