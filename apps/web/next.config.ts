import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@visapath/regulations",
    "@visapath/ai-advisor",
    "@visapath/supabase",
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
