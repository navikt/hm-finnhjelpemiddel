/** @type {import('next').NextConfig} */

const setAssetPefix = (nodeEnv, buildEnv, assetPrefix) => {
  const isProd = nodeEnv === 'production'
  const prefixAlphaOrDev = buildEnv === 'alpha' ? assetPrefix + '/alpha' : assetPrefix + '/dev'
  return isProd && buildEnv !== undefined ? prefixAlphaOrDev : undefined
}

const nextConfig = {
  assetPrefix: setAssetPefix(process.env.NODE_ENV, process.env.BUILD_ENV, process.env.ASSET_PREFIX),
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['no'],
    defaultLocale: 'no',
  },
  async rewrites() {
    return [
      {
        source: '/products/_search:path*',
        destination: process.env.HM_SEARCH_URL + '/products/_search:path*',
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
