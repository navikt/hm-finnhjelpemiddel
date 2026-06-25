'use client'

import { BodyLong, Heading, HGrid, HStack, LinkCard, VStack, Page } from '@navikt/ds-react'
import { NewsDTO } from '@/app/nyheter-test/news-util'
import NewsCard from '@/app/nyheter-test/NewsCard'

type NewsProps = {
  news?: NewsDTO[]
}

export default function NewsGridPage({ news }: NewsProps) {
  return (
    <Page>
      <Page.Block as="main" gutters>
        <HStack justify={'center'} padding={'space-16'}>
          <VStack gap={'space-8'} style={{ width: '100%', maxWidth: '1200px' }}>
            <Heading size="large" level="1">
              Nyheter
            </Heading>
            <HGrid gap={'space-20'} columns={{ xs: 1, sm: 2, md: 3 }}>
              {news?.map((news) => (
                <NewsCard news={news} key={news.id} />
              ))}
              {news && news.length === 0 && <BodyLong>Ingen nyheter matchet søket ditt.</BodyLong>}
            </HGrid>
          </VStack>
        </HStack>
      </Page.Block>
    </Page>
  )
}
