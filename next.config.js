/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone', // see: https://github.com/vercel/next.js/tree/canary/examples/with-docker
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
      { source: '/rammeavtale/blobs/:path*', destination: 'https://cdn.nav.no/teamdigihot/grunndata/media/v1/:path*' },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.hjelpemiddeldatabasen.no',
        pathname: '/**',
      },
    ],
  },
  env: {
    HM_SEARCH_URL: process.env.HM_SEARCH_URL,
    IMAGE_PROXY_URL: process.env.IMAGE_PROXY_URL,
    CDN_URL: process.env.CDN_URL,
  },
}

module.exports = nextConfig
