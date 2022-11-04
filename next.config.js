/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['no'],
    defaultLocale: 'no',
  },
  experimental: { appDir: true },
  async rewrites() {
    return [
      {
        source: '/product/_search:path*',
        destination: 'http://localhost:8080/product/_search:path*',
      },
    ]
  },
}

module.exports = nextConfig
