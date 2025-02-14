'use client'
import { Alert, Box, Heading, VStack } from '@navikt/ds-react'
import styles from './NewsPage.module.scss'
import useSWR from 'swr'
import { News } from '@/utils/news-util'
import { getNews } from '@/utils/api-util'
import { useMemo } from 'react'

export default function NewsPage() {
  const { data, error } = useSWR<News[]>('/news/_search', getNews, {
    keepPreviousData: true,
  })

  const sortedData = useMemo(() => {
    const newsMigrationDate = new Date('April 01, 2024')
    if (!data) return []
    const sorted = [...data] // Create a copy of data to avoid modifying it in place

    return sorted
      .sort((a, b) => b.published.getTime() - a.published.getTime())
      .filter((news) => news.published.getTime() >= newsMigrationDate.getTime() && news.expired >= new Date(Date.now()))
  }, [data])

  return (
    <div className={styles.page}>
      <VStack gap={'4'}>
        <Heading size={'large'} level={'1'}>
          Nyheter
        </Heading>
        {error ? (
          <Alert variant={'error'}>Kunne ikke laste nyheter, prøv igjen.</Alert>
        ) : (
          <VStack gap={'4'}>{data && sortedData.map((news) => <NewsCard key={news.id} news={news} />)}</VStack>
        )}
      </VStack>
    </div>
  )
}

const type = (title: string): [string, string] | string => {
  const splitTitle = title.split(':')
  return splitTitle.length > 1 ? [title.split(':')[0], title.split(':')[1]] : title
}
const NewsCard = ({ news }: { news: News }) => {
  const splitNewsTitle = type(news.title)
  return (
    <Box paddingInline={'8'} paddingBlock={'10'} className={styles.newsCard}>
      <VStack gap={'2'}>
        {Array.isArray(splitNewsTitle) ? (
          <>
            <Heading size={'small'} level={'3'}>
              {splitNewsTitle[0]}
            </Heading>
            <Heading size={'small'} level={'4'}>
              {splitNewsTitle[1]}
            </Heading>
          </>
        ) : (
          <Heading size={'small'} level={'3'}>
            {news.title}
          </Heading>
        )}

        <div dangerouslySetInnerHTML={{ __html: news.text }} />
      </VStack>
    </Box>
  )
}
