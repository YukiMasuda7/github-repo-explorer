import type { NextConfig } from "next";

const backendOrigin = process.env.NEXT_PUBLIC_API_URL;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/repositories", destination: `${backendOrigin}/repositories` },
    ];
  },
};

export default nextConfig;
