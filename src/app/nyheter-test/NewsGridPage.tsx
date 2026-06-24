'use client'

import { BodyLong, Heading, HGrid, HStack, LinkCard, VStack } from '@navikt/ds-react'
import { NewsDTO } from '@/app/nyheter-test/news-util'
import NewsCard from '@/app/nyheter-test/NewsCard'

type NewsProps = {
  news?: NewsDTO[]
}

export default function NewsGridPage({ news }: NewsProps) {
  return (
    <VStack gap="space-8" margin="space-20">
      <HStack justify="space-between" align="center">
        <Heading size="large" level="1">
          Nyheter
        </Heading>
      </HStack>

      <HGrid gap="space-12" columns={{ xs: 'repeat(auto-fit, minmax(10rem, 1fr))', md: 3 }}>
        {news?.map((news) => (
          <NewsCard news={news} key={news.id} />
        ))}
        {news && news.length === 0 && <BodyLong>Ingen nyheter matchet søket ditt.</BodyLong>}
      </HGrid>
    </VStack>
  )
}
