/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
