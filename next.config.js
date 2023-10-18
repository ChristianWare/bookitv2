/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
