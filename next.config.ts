// next.config.ts
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  standalone: true,

  images: {
    // In prod, only allow HTTPS image sources to avoid mixed-content blocks.
    // In dev, keep HTTP for localhost/VPS testing.
    remotePatterns: isProd
      ? [
        { protocol: "https", hostname: "api.lordevs.com" },
        { protocol: "https", hostname: "api.brilliant-ai.co.uk" },
        { protocol: "https", hostname: "api.cartwrightking.work" },
      ]
      : [
        { protocol: "http", hostname: "localhost" },
        { protocol: "http", hostname: "127.0.0.1" },
        { protocol: "http", hostname: "168.231.79.28" },
        { protocol: "http", hostname: "192.168.1.16" },
        { protocol: "https", hostname: "api.lordevs.com" },
        { protocol: "https", hostname: "api.cartwrightking.work" },
      ],

    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 hours for better caching
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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

  // Add security headers and cache management
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Optimize production bundle
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'framer-motion',
    ],
  },

  // Improve build performance
  poweredByHeader: false,

  // Compress output for better performance
  compress: true,

  // Set Turbopack root directory to prevent workspace root inference issues
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
