import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  /*
   * Local network origins for `next dev` while testing on a phone.
   * These were hardcoded to specific machines, which broke for everyone
   * else. Set ALLOWED_DEV_ORIGINS (comma separated) instead.
   */
  allowedDevOrigins: (
    process.env.ALLOWED_DEV_ORIGINS ??
    "localhost,127.0.0.1"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export default nextConfig;
