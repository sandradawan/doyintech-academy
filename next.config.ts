import type { NextConfig } from "next";

const ADMIN_PUBLIC = process.env.NEXT_PUBLIC_ADMIN_PATH || "/dt-ops-console";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
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
