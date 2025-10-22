import { Box, Heading, HStack, VStack } from '@navikt/ds-react'
import styles from './NewsFeed.module.scss'
import useSWR from 'swr'
import { News } from '@/utils/news-util'
import { getNews } from '@/utils/api-util'
import NextLink from 'next/link'
import { useEffect, useRef, useState } from 'react'

export const NewsFeed = () => {
  const { data } = useSWR<News[]>('/news/_search', () => getNews(3), {
    keepPreviousData: true,
  })

  return (
    <VStack gap={'11'} className={styles.container}>
      <Heading size={'large'} level={'2'}>
        Aktuelt
      </Heading>
      <HStack gap={'6'}>{data && data.map((news) => <NewsCard key={news.id} news={news} />)}</HStack>
    </VStack>
  )
}

const NewsCard = ({ news }: { news: News }) => {
  const type = (news: News): [string, string] | string => {
    const splitTitle = news.title.split(':')
    return splitTitle.length > 1 ? [news.title.split(':')[0], news.title.split(':')[1]] : news.title
  }

  const [isTruncated, setIsTruncated] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    // Allow layout to settle
    requestAnimationFrame(() => {
      if (el.scrollHeight > el.clientHeight + 4) {
        setIsTruncated(true)
      }
    })
  }, [news.id, news.text])

  return (
    <Box paddingInline={'8'} paddingBlock={'5'} className={styles.newsCard}>
      <VStack gap="1" className={styles.newsCard__content} ref={contentRef}>
        <Heading level="3" size="small" spacing>
          {Array.isArray(type(news)) ? type(news)[0] : type(news)}
        </Heading>
        {Array.isArray(type(news)) && (
          <Heading level="4" size="small" spacing>
            {type(news)[1]}
          </Heading>
        )}
        <div dangerouslySetInnerHTML={{ __html: news.text }} />
      </VStack>
      {isTruncated && (
        <NextLink
          href={`/nyheter/${news.id}`}
          className={styles.newsCard__readMore}
          aria-label={`Les hele nyheten: ${news.title}`}
        >
          Les mer
        </NextLink>
      )}
    </Box>
  )
}
