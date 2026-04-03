import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // Caso futuramente você use links da Amazon ou AliExpress, 
      // precisaremos adicionar os domínios deles aqui também.
    ],
  },
};

export default nextConfig;