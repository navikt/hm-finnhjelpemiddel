'use client'

import { getAllNews, NewsDTO } from '@/app/nyheter-test/news-util'
import { BodyLong, Heading, HGrid, HStack, LinkCard, VStack } from '@navikt/ds-react'
import useSWR from 'swr'
const HM_FINNHJELPEMIDDEL_NEWS_URL = process.env.HM_FINNHJELPEMIDDEL_NEWS_URL || ''

export default function NewsStack() {
  const { data: news } = useSWR<NewsDTO[]>('news', () => getAllNews())
  console.log(HM_FINNHJELPEMIDDEL_NEWS_URL)
  return (
    <VStack gap="space-8" margin="space-20">
      <HStack justify="space-between" align="center">
        <Heading size="large" level="1">
          ${HM_FINNHJELPEMIDDEL_NEWS_URL}
        </Heading>
      </HStack>

      <HGrid gap="space-12" columns={{ xs: 'repeat(auto-fit, minmax(10rem, 1fr))', md: 3 }}>
        {news?.map((news) => (
          <LinkCard key={news.id} style={{ height: '100%', minHeight: '180px' }}>
            <HStack justify="space-between" align="start" gap="space-8" wrap={false} style={{ height: '100%' }}>
              <VStack gap="space-2" style={{ flex: 1, minWidth: 0, height: '100%' }}>
                <Heading size="small" level="2">
                  {news.title}
                </Heading>
                <BodyLong
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {news.description}
                </BodyLong>
              </VStack>
              <HStack gap="space-2"></HStack>
            </HStack>
          </LinkCard>
        ))}
        {news && news.length === 0 && <BodyLong>Ingen nyheter matchet søket ditt.</BodyLong>}
      </HGrid>
    </VStack>
  )
}
