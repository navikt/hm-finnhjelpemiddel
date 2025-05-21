import { Box, Heading, HStack, VStack } from '@navikt/ds-react'
import styles from './NewsFeed.module.scss'
import useSWR from 'swr'
import { News } from '@/utils/news-util'
import { getNews } from '@/utils/api-util'

export const NewsFeed = () => {
  const { data } = useSWR<News[]>('/news/_search', () => getNews(3), {
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
  const type = (news: News): [string, string] | string => {
    const splitTitle = news.title.split(':')
    return splitTitle.length > 1 ? [news.title.split(':')[0], news.title.split(':')[1]] : news.title
  }

  return (
    <Box paddingInline={'8'} paddingBlock={'5'} className={styles.newsCard}>
      <VStack gap="1">
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
    </Box>
  )
}
