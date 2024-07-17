'use client'

import { useRef } from 'react'

import { BodyLong, BodyShort, Heading, HStack, Link } from '@navikt/ds-react'

import ReadMore from '@/components/ReadMore'
import { Agreement, agreementHasNoProducts } from '@/utils/agreement-util'
import NextLink from 'next/link'

const Accessories = ({ agreement }: { agreement: Agreement }) => {
  const headingRef = useRef<HTMLHeadingElement>(null)


  return (
    <>
      <HStack gap="3">
        <Link as={NextLink} href="/" variant="subtle">
          {`${agreement.title}`}
        </Link>
        <BodyShort textColor="subtle">/</BodyShort>
      </HStack>
      <Heading level="1" size="large" className="agreement-page__heading">
        Tilbehør
      </Heading>
    </>
  )
}

export default Accessories
