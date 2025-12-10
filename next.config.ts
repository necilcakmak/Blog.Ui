import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: false,

  async rewrites() {
    return [
      // Örnek: /about → /site/about
      {
        source: "/about",
        destination: "/site/about",
      },
      {
        source: "/login",
        destination: "/site/login",
      },
        {
        source: "/register",
        destination: "/site/register",
      },
      // Ana sayfa root yönlendirmesi
      {
        source: "/",
        destination: "/site",
      },
    ];
  },
};

export default nextConfig;
