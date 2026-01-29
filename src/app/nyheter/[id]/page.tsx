import styles from '@/app/nyheter/NewsArticle.module.scss'
import { getNewsById } from '@/utils/api-util'
import { News } from '@/utils/news-util'
import { BodyLong, Heading, Link, Tag, VStack } from '@navikt/ds-react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanitize } from '@/utils/news-html-util'
import NextLink from 'next/link'
function splitTitle(full: string): { main: string; sub?: string } {
  const parts = full.split(':')
  if (parts.length < 2) return { main: full }
  return { main: parts[0], sub: parts.slice(1).join(':').trim() }
}

// Conform to Next.js generated PageProps: params is (optionally) a Promise of dynamic segment map.
export async function generateMetadata({
  params,
}: {
  params?: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const resolved = params ? await params : undefined
  const rawId = resolved?.id
  const id = Array.isArray(rawId) ? rawId[0] : rawId
  if (!id) {
    return { title: 'Nyhet ikke funnet', description: 'Nyheten finnes ikke eller er utgått.' }
  }
  const news = await getNewsById(id)
  if (!news) {
    return { title: 'Nyhet ikke funnet', description: 'Nyheten finnes ikke eller er utgått.' }
  }
  const { main } = splitTitle(news.title)
  const plain = news.text
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return {
    title: main,
    description: plain.slice(0, 160),
  }
}

export default async function NewsArticlePage({
  params,
}: {
  params?: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolved = params ? await params : undefined
  const rawId = resolved?.id
  const id = Array.isArray(rawId) ? rawId[0] : rawId
  if (!id) return notFound()

  const news: News | null = await getNewsById(id)
  if (!news) return notFound()

  const { main, sub } = splitTitle(news.title)
  const sanitizedHtml = sanitize(news.text)
  const isExpired = news.expired.getTime() <= Date.now()
  const publishedISO = news.published.toISOString()
  const publishedStr = news.published.toLocaleDateString('nb-NO')

  return (
    <VStack className={styles.container} gap="space-32" padding="space-32">
      <article aria-labelledby="news-main-title" className={styles.articleContainer}>
        <header>
          <VStack gap="space-16" className={styles.headerGroup}>
            <Heading id="news-main-title" level="1" size="large">
              {main}
            </Heading>
            {sub && (
              <Heading level="2" size="medium" className={styles.subTitle}>
                {sub}
              </Heading>
            )}
            <div className={styles.metaRow}>
              <time dateTime={publishedISO}>Publisert: {publishedStr}</time>
              {isExpired && (
                <span className={styles.statusTagWrapper}>
                  <Tag size="small" variant="neutral-moderate">
                    Utgått
                  </Tag>
                </span>
              )}
            </div>
          </VStack>
        </header>

        <div id="article-body" className={styles.articleBody} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: main,
              articleBody: sanitizedHtml
                .replace(/<[^>]*>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
                .slice(0, 5000),
              datePublished: publishedISO,
              dateModified: publishedISO,
              dateCreated: publishedISO,
              inLanguage: 'nb-NO',
              author: { '@type': 'Organization', name: 'NAV' },
            }),
          }}
        />
      </article>
      <BodyLong className={styles.backLink}>
        <Link as={NextLink} href="/">
          ← Til forsiden
        </Link>
      </BodyLong>
    </VStack>
  )
}
