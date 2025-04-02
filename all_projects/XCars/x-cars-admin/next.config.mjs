/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['d2cj31bsdri8xb.cloudfront.net'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'x-cars.s3.ap-south-1.amazonaws.com',
        pathname: '/assets/images/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
