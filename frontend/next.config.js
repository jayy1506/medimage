/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable persistent pack file cache to prevent OneDrive file-locking ENOENT errors on *.pack.gz
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
