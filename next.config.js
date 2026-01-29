/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig