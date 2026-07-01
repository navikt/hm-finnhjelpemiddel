'use client'

import { BodyLong, Button, Heading, VStack } from '@navikt/ds-react'
import { NewsDTO } from '@/app/nyheter-test/news-util'
import SmallNewsCard from '@/app/nyheter-test/SmallNewsCard'
import NextLink from 'next/link'
import { ArrowRightIcon } from '@navikt/aksel-icons'

type Props = {
  news?: NewsDTO[]
}

export default function NewsVstack({ news }: Props) {
  return (
    <VStack gap="space-16"  maxWidth={'600px'} width={'100%'}>
      <Heading level={'2'} size={'large'}>Aktuelt</Heading>
      {news?.map((news) => (
        <SmallNewsCard news={news} key={news.id} />
      ))}
      {news && news.length === 0 && <BodyLong>Ingen nyheter matchet søket ditt.</BodyLong>}
      <Button
        as={NextLink}
        href="/nyheter-test/aktuelt"
        variant={'tertiary'}
        icon={<ArrowRightIcon />}
        style={{ alignSelf: 'flex-start' }}
      >
        Flere saker
      </Button>
    </VStack>
  )
}
