import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return {
      beforeFiles: [
        {
          source: "/sitemap.xml",
          destination: "/sitemap.xml",
        },
        {
          source: "/robots.txt",
          destination: "/robots.txt",
        },
      ],
      afterFiles: [
        {
          source: "/api/:path*",
          destination: `${backendUrl}/api/:path*`,
        },
      ],
      fallback: [],
    };
  },
  images: {
    remotePatterns: [
      { hostname: "ibb.co" },
      { hostname: "i.ibb.co" },
      { protocol: "http", hostname: "localhost", port: "5000" },
      { protocol: "http", hostname: "localhost", port: "3000" },
      { protocol: "https", hostname: "**.railway.app" },
      { protocol: "https", hostname: "**.render.com" },
      { protocol: "https", hostname: "**.onrender.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
