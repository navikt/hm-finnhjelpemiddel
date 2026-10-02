'use client'

import { NewsCardFrontPage } from '@/app/aktuelt/NewsCardFrontPage'
import { getNews } from '@/app/aktuelt/news-util'

import NextLink from 'next/link'

import useSWR from 'swr'

import { ArrowRightIcon } from '@navikt/aksel-icons'
import { BodyLong, Button, Heading, Loader, VStack } from '@navikt/ds-react'

export default function NewsFrontPage() {
  const { data: news, isLoading } = useSWR('news-vstack', () => getNews(4), { keepPreviousData: true })

  return (
    <VStack gap="space-24" width={'100%'}>
      <Heading level={'2'} size={'large'}>
        Aktuelt
      </Heading>
      {isLoading && <Loader size="small" />}
      <VStack gap="space-16">
        {news?.map((news) => (
          <NewsCardFrontPage news={news} key={news.id} />
        ))}
      </VStack>
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
