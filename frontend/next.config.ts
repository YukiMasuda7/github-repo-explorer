import type { NextConfig } from "next";

const backendOrigin = process.env.NEXT_PUBLIC_API_BASE_URL;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/search", destination: `${backendOrigin}/search` },
      { source: "/hello", destination: `${backendOrigin}/hello` },
    ];
  },
};

export default nextConfig;
