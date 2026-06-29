import { BodyLong, Heading, VStack } from '@navikt/ds-react'
import { getNews, NewsDTO } from '@/app/nyheter-test/news-util'
import NewsCard from '@/app/nyheter-test/NewsCard'
import useSWR from 'swr'

type Props = {
  news?: NewsDTO[]
}

export default function NewsVstack({ news }: Props) {
  return (
    <VStack>
      <Heading size={'small'}>Aktuelt</Heading>
      {news?.map((news) => (
        <NewsCard news={news} key={news.id} />
      ))}
      {news && news.length === 0 && <BodyLong>Ingen nyheter matchet søket ditt.</BodyLong>}
    </VStack>
  )
}
