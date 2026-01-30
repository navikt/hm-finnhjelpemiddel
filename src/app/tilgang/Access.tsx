import { Heading } from '@/components/aksel-client'
import { VStack } from '@navikt/ds-react'
import Link from 'next/link'

export const Access = () => {
  return (
    <VStack
      marginInline={'auto'}
      marginBlock={'space-0'}
      maxWidth={'1280px'}
      paddingBlock={{ xs: 'space-64', md: 'space-80' }}
      paddingInline={{ xs: 'space-16' }}
    >
      <Heading level="1" size="large" className="spacing-bottom--medium">
        Beklager, brukeren din har ikke tilgang til denne siden.
      </Heading>
      <Link href="/" style={{ width: 'fit-content' }}>
        Gå til forsiden
      </Link>
    </VStack>
  )
}
