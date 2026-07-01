'use client'

import { BodyLong, Heading, HGrid, HStack, VStack, Button } from '@navikt/ds-react'
import { NewsDTO } from '@/app/nyheter-test/news-util'
import NewsCard from '@/app/nyheter-test/NewsCard'
import { ArrowRightIcon } from '@navikt/aksel-icons'
import NextLink from 'next/link'

type Props = {
  news?: NewsDTO[]
}

export default function NewsStack({ news }: Props) {

  return (
        <HStack justify={'center'} padding={'space-16'}>
          <VStack gap={'space-8'} style={{ width: '100%', maxWidth: '1200px' }}>
            <Heading size="large" level="1">
              Aktuelt
            </Heading>
            <HGrid gap={'space-20'} columns={{ xs: 1, sm: 2, md: 3 }}>
              {news?.map((news) => (
                <NewsCard news={news} key={news.id} />
              ))}
              {news && news.length === 0 && <BodyLong>Ingen nyheter matchet søket ditt.</BodyLong>}
            </HGrid>
            <Button as={NextLink} href='/nyheter-test/aktuelt' variant={'tertiary'} icon={<ArrowRightIcon />} style={{ alignSelf: 'flex-start' }}
            >Flere saker</Button>
          </VStack>
        </HStack>
  )
}
