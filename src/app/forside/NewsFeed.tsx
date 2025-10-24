import { Box, Heading, HStack, Loader, VStack } from '@navikt/ds-react'
import styles from './NewsFeed.module.scss'
import useSWR from 'swr'
import { News } from '@/utils/news-util'
import { getNews } from '@/utils/api-util'
import NextLink from 'next/link'
import { buildNewsPreview } from '@/utils/news-html-util'

export const NewsFeed = () => {
  const { data, isLoading } = useSWR<News[]>('/news/_search', () => getNews(3), {
    keepPreviousData: true,
  })

  if (isLoading) {
    return <Loader size="small" />
  }
  if (!data || data.length === 0) return null

  return (
    <VStack gap={'11'} className={styles.container}>
      <Heading size={'large'} level={'2'}>
        Aktuelt
      </Heading>
      {/* Mobile simple list */}
      <div className={styles.mobileList} aria-label="Aktuelt nyheter (mobil visning)">
        <ul className={styles.mobileList__ul}>
          {data.map((news) => {
            const split = news.title.split(':')
            const hasSub = split.length > 1
            const mainTitle = hasSub ? split[0] : news.title
            const subTitle = hasSub ? split.slice(1).join(':').trim() : ''
            return (
              <li key={news.id} className={styles.mobileList__item}>
                <NextLink
                  href={`/nyheter/${news.id}`}
                  className={styles.mobileList__link}
                  aria-label={`Les nyheten: ${news.title}`}
                >
                  <span className={styles.mobileList__main}>{mainTitle}</span>
                  {hasSub && <span className={styles.mobileList__sub}>: {subTitle}</span>}
                </NextLink>
              </li>
            )
          })}
        </ul>
      </div>
      {/* Desktop cards */}
      <HStack className={styles.cardsWrapper}>
        {data.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </HStack>
    </VStack>
  )
}

// Reduced preview limit for shorter cards. Adjust here if needed.
const PREVIEW_CHAR_LIMIT = 160

const NewsCard = ({ news }: { news: News }) => {
  const split = news.title.split(':')
  const hasSub = split.length > 1
  const mainTitle = hasSub ? split[0] : news.title
  const subTitle = hasSub ? split.slice(1).join(':').trim() : ''

  const { previewHtml, truncated } = buildNewsPreview(news.text, PREVIEW_CHAR_LIMIT)

  return (
    <Box paddingInline={'6'} paddingBlock={'4'} className={styles.newsCard}>
      <VStack gap="1" className={styles.newsCard__content}>
        <Heading level="3" size="small" spacing>
          {mainTitle}
        </Heading>
        {hasSub && (
          <Heading level="4" size="small" spacing>
            {subTitle}
          </Heading>
        )}
        {previewHtml && (
          <div
            className={styles.newsCard__excerpt}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        )}
      </VStack>
      {truncated && (
        <NextLink
          href={`/nyheter/${news.id}`}
          className={styles.newsCard__readMore}
          aria-label={`Les hele saken: ${news.title}`}
        >
          Les hele saken
        </NextLink>
      )}
    </Box>
  )
}

export default NewsFeed
