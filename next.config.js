/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  // Enable standalone for Docker/edge deployments
  // output: 'standalone',
};

module.exports = nextConfig;
