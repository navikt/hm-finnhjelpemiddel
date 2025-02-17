'use client'
import { Alert, Box, Detail, Heading, VStack } from '@navikt/ds-react'
import styles from './NewsPage.module.scss'
import useSWR from 'swr'
import { News } from '@/utils/news-util'
import { dateToString } from '@/utils/string-util'
import { getNews } from '@/utils/api-util'

export default function NewsPage() {
  const { data, error } = useSWR<News[]>('/news/_search', () => getNews(), {
    keepPreviousData: true,
  })

  return (
    <div className={styles.page}>
      <VStack gap={'4'}>
        <Heading size={'large'} level={'1'}>
          Nyheter
        </Heading>
        {error ? (
          <Alert variant={'error'}>Kunne ikke laste nyheter, prøv igjen.</Alert>
        ) : (
          <VStack gap={'4'}>{data && data.map((news) => <NewsCard key={news.id} news={news} />)}</VStack>
        )}
      </VStack>
    </div>
  )
}

const splitTitle = (title: string): [string, string] | string => {
  const splitTitle = title.split(':')
  return splitTitle.length > 1 ? [title.split(':')[0], title.split(':')[1]] : title
}
const NewsCard = ({ news }: { news: News }) => {
  const splitNewsTitle = splitTitle(news.title)
  return (
    <Box paddingInline={'8'} paddingBlock={'10'} className={styles.newsCard}>
      <VStack gap={'2'}>
        <Detail>Publisert: {dateToString(news.published)}</Detail>
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
