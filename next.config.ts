import type { NextConfig } from "next";

const ADMIN_PUBLIC = process.env.NEXT_PUBLIC_ADMIN_PATH || "/dt-ops-console";

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // Baseline CSP — tighten further once all third-party origins are enumerated
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.google.com https://js.paystack.co https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://i.ytimg.com https://img.youtube.com https://images.unsplash.com https://*.supabase.co",
      "font-src 'self' https://fonts.gstatic.com data:",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://js.paystack.co",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.paystack.co https://js.paystack.co https://emkc.org https://*.vercel.app",
      "media-src 'self' https://www.youtube.com blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    const base = ADMIN_PUBLIC.replace(/\/$/, "");
    return [
      { source: base, destination: "/admin" },
      { source: `${base}/:path*`, destination: "/admin/:path*" },
    ];
  },
};

export default nextConfig;
