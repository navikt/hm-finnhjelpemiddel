import { BodyShort, Heading } from '@/components/aksel-client'
import { Link, List, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'

export const NotFound = () => {
  return (
    <VStack
      marginInline={'auto'}
      marginBlock={'space-0'}
      maxWidth={'1280px'}
      paddingBlock={{ xs: 'space-64', md: 'space-80' }}
      paddingInline={{ xs: 'space-16' }}
    >
      <Heading level="1" size="large" className="spacing-bottom--medium">
        Beklager, vi fant ikke siden
      </Heading>
      <BodyShort>Denne siden kan være slettet eller flyttet, eller det er en feil i lenken.</BodyShort>
      <List>
        <List.Item>Bruk gjerne søket eller menyen</List.Item>
        <List.Item>
          <Link as={NextLink} href="/">
            Gå til forsiden
          </Link>
        </List.Item>
      </List>
    </VStack>
  )
}
