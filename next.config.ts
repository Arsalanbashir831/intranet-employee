// next.config.ts
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  images: {
    // In prod, only allow HTTPS image sources to avoid mixed-content blocks.
    // In dev, keep HTTP for localhost/VPS testing.
    remotePatterns: isProd
      ? [
          { protocol: "https", hostname: "api.lordevs.com" },
          { protocol: "https", hostname: "api.brilliant-ai.co.uk" },
        ]
      : [
          { protocol: "http", hostname: "127.0.0.1" },
          { protocol: "http", hostname: "168.231.79.28" },
          { protocol: "http", hostname: "192.168.1.16" },
          { protocol: "https", hostname: "api.lordevs.com" },
        
        ],
  },

  async rewrites() {
    // Proxy API calls so the browser never hits HTTP from an HTTPS page.
    return isProd
      ? [
          {
            source: "/api/:path*",
            destination: "https://api.lordevs.com/:path*",
          },
        ]
      : [
          {
            source: "/api/:path*",
            destination: "http://127.0.0.1:8000/:path*", // adjust your dev API port
          },
        ];
  },
};

export default nextConfig;
