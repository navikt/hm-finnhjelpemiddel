import { BodyShort, Heading } from '@/components/aksel-client'
import { List, VStack } from '@navikt/ds-react'
import Link from 'next/link'

export const NotFound = () => {
  return (
    <VStack
      marginInline={'auto'}
      marginBlock={'0'}
      maxWidth={'1280px'}
      paddingBlock={{ xs: '16', md: '20' }}
      paddingInline={{ xs: '4' }}
    >
      <Heading level="1" size="large" className="spacing-bottom--medium">
        Beklager, vi fant ikke siden
      </Heading>
      <BodyShort>Denne siden kan være slettet eller flyttet, eller det er en feil i lenken.</BodyShort>
      <List>
        <List.Item>Bruk gjerne søket eller menyen</List.Item>
        <List.Item>
          <Link href="/">Gå til forsiden</Link>
        </List.Item>
      </List>
    </VStack>
  )
}
