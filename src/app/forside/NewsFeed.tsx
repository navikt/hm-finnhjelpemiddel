import { BodyShort, Box, Heading, HStack, Link, Loader, VStack } from '@navikt/ds-react'
import styles from './NewsFeed.module.scss'
import useSWR from 'swr'
import { News } from '@/utils/news-util'
import { getNews } from '@/utils/api-util'
import NextLink from 'next/link'
import { buildNewsPreview } from '@/utils/news-html-util'
import { dateToString } from '@/utils/string-util'

export const NewsFeed = () => {
  const { data, isLoading } = useSWR<News[]>('/news/_search', () => getNews(3), {
    keepPreviousData: true,
  })

  if (isLoading) {
    return <Loader size="small" />
  }
  if (!data || data.length === 0) return null

  return (
    <VStack gap={'space-20'} className={styles.container} paddingInline={{ lg: 'space-24' }}>
      <Heading size={'large'} level={'2'}>
        Aktuelt
      </Heading>
      <HStack gap={'space-24'}>
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
    <Box paddingInline={'space-24'} paddingBlock={'space-16'} className={styles.newsCard}>
      <VStack gap="space-4" className={styles.newsCard__content}>
        <BodyShort weight={'regular'}>{mainTitle}</BodyShort>
        <Link as={NextLink} href={`/nyheter/${news.id}`} data-color={'neutral'} aria-label={`Les mer: ${news.title}`}>
          <BodyShort weight={'semibold'}>{subTitle}</BodyShort>
        </Link>
        <BodyShort className={styles.newsCard__date}>{dateToString(news.published)}</BodyShort>
      </VStack>
    </Box>
  )
}

export default NewsFeed
