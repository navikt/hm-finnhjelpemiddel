'use client'

import { BodyLong, Button, Heading, Loader, VStack } from '@navikt/ds-react'
import { getNews } from '@/app/aktuelt/news-util'
import SmallNewsCard from '@/app/aktuelt/SmallNewsCard'
import NextLink from 'next/link'
import { ArrowRightIcon } from '@navikt/aksel-icons'
import useSWR from 'swr'

export default function NewsVerticalFeed() {
  const { data: news, isLoading } = useSWR('news-vstack', () => getNews(4), { keepPreviousData: true })

  return (
    <VStack gap="space-16"  maxWidth={'600px'} width={'100%'}>
      <Heading level={'2'} size={'large'}>Aktuelt</Heading>
      {isLoading && <Loader size="small" />}
      {news?.map((news) => (
        <SmallNewsCard news={news} key={news.id} />
      ))}
      {news && news.length === 0 && <BodyLong>Ingen aktuelle saker tilgjengelig</BodyLong>}
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
