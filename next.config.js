/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone', // see: https://github.com/vercel/next.js/tree/canary/examples/with-docker
  assetPrefix: process.env.ASSET_PREFIX || undefined,
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/products/_search/:path*',
        destination: process.env.HM_SEARCH_URL + '/products/_search:path*',
      },
      {
        source: '/agreements/_search/:path*',
        destination: process.env.HM_SEARCH_URL + '/agreements/_search/:path*',
      },
      {
        source: '/news/_search/:path*',
        destination: process.env.HM_SEARCH_URL + '/news/_search/:path*',
      },
      {
        source: '/suppliers/_search/:path*',
        destination: process.env.HM_SEARCH_URL + '/suppliers/_search/:path*',
      },
      {
        source: '/alternative_products/_search/:path*',
        destination: process.env.HM_SEARCH_URL + '/alternative_products/_search/:path*',
      },
      {
        source: '/alternativ/:path*',
        destination: process.env.HM_GRUNNDATA_ALTERNATIVPRODUKTER_URL + '/alternativ/:path*',
      },
      {
        source: '/alternativprodukter',
        destination: '/gjenbruksprodukter',
      },
      {
        source: '/finngjenbruksprodukt',
        destination: '/gjenbruksprodukter',
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
    RUNTIME_ENVIRONMENT: process.env.RUNTIME_ENVIRONMENT,
    BUILD_ENV: process.env.BUILD_ENV,
    HM_OEBS_API_URL: process.env.HM_OEBS_API_URL,
    NEXT_PUBLIC_FARO_URL: process.env.FARO_URL,
  },
  experimental: {
    optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
  },
}

module.exports = nextConfig
