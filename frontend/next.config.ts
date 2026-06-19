import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    dangerouslyAllowLocalIP: true,
    unoptimized: process.env.NEXT_IMAGE_UNOPTIMIZED === "true",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4001",
        pathname: "/images/**",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
