/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/health',
        destination: 'http://127.0.0.1:8000/health',
      },
      {
        source: '/api/v1/:path*',
        destination: 'http://127.0.0.1:8000/api/v1/:path*',
      },
    ];
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
