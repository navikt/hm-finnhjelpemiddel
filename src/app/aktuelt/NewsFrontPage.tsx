'use client'

import NewsCard from '@/app/aktuelt/NewsCard'
import SmallNewsCard from '@/app/aktuelt/SmallNewsCard'
import { getNews } from '@/app/aktuelt/news-util'

import NextLink from 'next/link'

import useSWR from 'swr'

import { ArrowRightIcon } from '@navikt/aksel-icons'
import { BodyLong, Button, HGrid, Heading, Loader, Show, VStack } from '@navikt/ds-react'

export default function NewsFrontPage() {
  const { data: news, isLoading } = useSWR('news-vstack', () => getNews(4), { keepPreviousData: true })

  return (
    <VStack gap="space-16" width={'100%'}>
      <Heading level={'2'} size={'large'}>
        Aktuelt
      </Heading>
      {isLoading && <Loader size="small" />}
      <Show above={'lg'}>
        <VStack gap="space-16">
          {news?.map((news) => (
            <SmallNewsCard news={news} key={news.id} />
          ))}
        </VStack>
      </Show>
      <Show below={'lg'}>
        <HGrid gap="space-16" columns={{ xs: 1, sm: 2 }}>
          {news?.map((news) => (
            <NewsCard news={news} key={news.id} />
          ))}
        </HGrid>
      </Show>
      {news && news.length === 0 && <BodyLong>Ingen aktuelle saker tilgjengelig</BodyLong>}
      {!news && <BodyLong>Kan ikke vise aktuelle saker</BodyLong>}
      <Button
        as={NextLink}
        href="/aktuelt"
        variant={'tertiary'}
        icon={<ArrowRightIcon />}
        style={{ alignSelf: 'flex-start' }}
      >
        Flere saker
      </Button>
    </VStack>
  )
}
