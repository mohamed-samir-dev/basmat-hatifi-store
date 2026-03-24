import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },
  images: {
    remotePatterns: [
      { hostname: "ibb.co" },
      { hostname: "i.ibb.co" },
    ],
  },
};

export default nextConfig;
