import { BodyShort, HStack, Heading, Link, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'

const Header = ({ agreementTitle }: { agreementTitle: string }) => {
  return (
    <VStack gap="5" className="spacing-top--large spacing-bottom--xlarge">
      <HStack gap="3">
        <Link as={NextLink} href="/" variant="subtle">
          Alle hjelpemiddel
        </Link>
        <BodyShort textColor="subtle">/</BodyShort>
      </HStack>
      <Heading level="1" size="large">
        {agreementTitle}
      </Heading>
    </VStack>
  )
}
export default Header
