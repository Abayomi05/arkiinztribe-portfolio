import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "172.20.224.58",
    "10.49.149.215",
    "100.93.138.245",
  ],
};

export default nextConfig;
