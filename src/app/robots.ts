import { MetadataRoute } from 'next'

const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/products/_search', '/agreements/_search'],
    },
    sitemap: 'https://finnhjelpemiddel.nav.no/sitemap.xml',
  }
}

export default robots
