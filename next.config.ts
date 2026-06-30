import type { NextConfig } from 'next';

async function rewrites() {
  const DOMAIN = process.env.DOMAIN_API;
  return [
    { source: '/api/:path*', destination: DOMAIN + '/api/:path*' },
  ];
}

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost', port: '4001' },
      { protocol: 'https', hostname: '**' },
      { protocol: 'http',  hostname: '**' },
    ],
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  rewrites,
};

export default nextConfig;
