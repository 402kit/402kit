/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@402kit/server'],
  },
};

module.exports = nextConfig;
