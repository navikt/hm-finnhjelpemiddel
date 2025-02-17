import { BodyShort, Box, Detail, Heading, HStack, Link, VStack } from '@navikt/ds-react'
import styles from './NewsFeed.module.scss'
import useSWR from 'swr'
import { News } from '@/utils/news-util'
import { getNews } from '@/utils/api-util'
import NextLink from 'next/link'
import { dateToString } from '@/utils/string-util'

export const NewsFeed = () => {
  const { data, error } = useSWR<News[]>('/news/_search', () => getNews(3), {
    keepPreviousData: true,
  })

  return (
    <VStack gap={'11'} className={styles.container}>
      <Heading size={'large'} level={'2'}>
        Siste nytt
      </Heading>
      <HStack gap={'6'}>{data && data.map((news) => <NewsCard key={news.id} news={news} />)}</HStack>
    </VStack>
  )
}

const newsIngress = (text: string) => {
  const removeHtmlExp = new RegExp(/(<([^>]+)>)/gi)
  const cleanText = text.replace(removeHtmlExp, '')

  const words = cleanText.match(/(\w.*?\.)(?:\s[A-Z]|$)/)

  return words ? words[1] : ''
}

const NewsCard = ({ news }: { news: News }) => {
  return (
    <Box paddingInline={'8'} paddingBlock={'5'} className={styles.newsCard}>
      <VStack gap={'2'} justify={'space-around'}>
        <Detail>{dateToString(news.published)}</Detail>
        <Heading size={'small'} level={'3'}>
          {news.title}
        </Heading>
        <BodyShort>{newsIngress(news.text)}</BodyShort>
        <Link as={NextLink} href={'/ny/nyheter'}>
          Les mer
        </Link>
      </VStack>
    </Box>
  )
}
