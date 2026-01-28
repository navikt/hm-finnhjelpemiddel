import { BodyShort, Heading } from '@/components/aksel-client'
import { VStack } from '@navikt/ds-react'
import Link from 'next/link'

export const Access = () => {
  return (
    <VStack
      marginInline={'auto'}
      marginBlock={'0'}
      maxWidth={'1280px'}
      paddingBlock={{ xs: '16', md: '20' }}
      paddingInline={{ xs: '4' }}
    >
      <Heading level="1" size="large" className="spacing-bottom--medium">
        Beklager, brukeren din har ikke tilgang til denne siden.
      </Heading>
      <BodyShort>Ta kontakt med Team Mime/Digihot</BodyShort>
      <Link href="/" style={{ width: 'fit-content' }}>
        Gå til forsiden
      </Link>
    </VStack>
  )
}
