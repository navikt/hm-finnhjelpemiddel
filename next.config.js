/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'
const prefixAlphaOrDev =
  process.env.DEV_ENV === 'alpha' ? process.env.ASSET_PREFIX + '/alpha' : process.env.ASSET_PREFIX + '/dev'

const nextConfig = {
  assetPrefix: isProd ? prefixAlphaOrDev : undefined,
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
        destination: process.env.HM_SEARCH_URL + '/product/_search:path*',
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.hjelpemiddeldatabasen.no',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
    ],
  },
  env: {
    HM_SEARCH_URL: process.env.HM_SEARCH_URL,
  },
}

module.exports = nextConfig
