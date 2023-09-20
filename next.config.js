/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone', // see: https://github.com/vercel/next.js/tree/canary/examples/with-docker
  assetPrefix: process.env.ASSET_PREFIX || undefined,
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
      {
        source: '/agreements/_search:path*',
        destination: process.env.HM_SEARCH_URL + '/agreements/_search:path*',
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
    ],
  },
  env: {
    //https://nextjs.org/docs/app/api-reference/next-config-js/env
    //To add environment variables to the JavaScript bundle (client side) add the env config.
    IMAGE_PROXY_URL: process.env.IMAGE_PROXY_URL,
    CDN_URL: process.env.CDN_URL,
  },
}

module.exports = nextConfig
