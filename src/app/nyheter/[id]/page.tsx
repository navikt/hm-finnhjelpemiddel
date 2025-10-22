import styles from '@/app/nyheter/NewsArticle.module.scss'
import { getNewsById } from '@/utils/api-util'
import { News } from '@/utils/news-util'
import { BodyLong, Heading, Tag, VStack } from '@navikt/ds-react'
import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Simple sanitizer: strips script/style tags and inline event handlers
function sanitize(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/ on[a-z]+=('[^']*'|"[^"]*")/gi, '')
    .replace(/javascript:/gi, '')
}

function splitTitle(full: string): { main: string; sub?: string } {
  const parts = full.split(':')
  if (parts.length < 2) return { main: full }
  return { main: parts[0], sub: parts.slice(1).join(':').trim() }
}

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const news = await getNewsById(params.id)
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

export default async function NewsArticlePage({ params }: PageProps) {
  const id = params.id
  if (!id) return notFound()

  const news: News | null = await getNewsById(id)
  if (!news) return notFound()

  const { main, sub } = splitTitle(news.title)
  const sanitizedHtml = sanitize(news.text)
  const isExpired = news.expired.getTime() <= Date.now()
  const publishedISO = news.published.toISOString()
  const publishedStr = news.published.toLocaleDateString('nb-NO')

  return (
    <VStack className={styles.container} gap="8" padding="8">
      <article aria-labelledby="news-main-title" className={styles.articleContainer}>
          <header>
            <VStack gap="4" className={styles.headerGroup}>
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
          // eslint-disable-next-line react/no-danger
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
        <Link href="/">← Til forsiden</Link>
      </BodyLong>
    </VStack >
  )
}
