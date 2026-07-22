import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["prospectlabs.ctonew.app"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [{ protocol: "https" as const, hostname: "**" }],
  },
};

export default nextConfig;
