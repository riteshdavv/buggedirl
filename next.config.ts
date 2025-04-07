import type { NextConfig } from "next";

const nextConfig = {
  images: {
    domains: ['i.imgflip.com'], // <- add your external domain here
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig;

export default nextConfig;
