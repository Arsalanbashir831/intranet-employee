import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "168.231.79.28",
      },
      {
        protocol: "https",
        hostname: "api.lordevs.com",
      },
    ],
  },
};

export default nextConfig;
