import { mapAgreementFromDoc } from '@/utils/agreement-util'
import { getAgreement } from '@/utils/api-util'
import { BodyShort, HStack, Heading, Link, VStack } from '@navikt/ds-react'
import { Metadata } from 'next'
import NextLink from 'next/link'
import { Suspense } from 'react'
import AgreementSearch from './AgreementSearch'

type Props = {
  params: { agreementId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const agreementId = params.agreementId
  const agreement = mapAgreementFromDoc(await getAgreement(agreementId))
  // Data vil cashes og blir ikke hentet på nytt på produktsiden: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
  //   const agreement = mapAgreementFromSearch(await getAgreementFromLabel(agreementLabel))
  //TODO: må ha fornuftig title
  return {
    title: agreement.label,
    description: `Produkter under avtale ${agreement.title} med NAV`,
  }
}

export default async function AgreementPage({ params }: Props) {
  const agreement = mapAgreementFromDoc(await getAgreement(params.agreementId))
  return (
    <Suspense>
      <VStack className="main-wrapper--large spacing-bottom--large">
        <VStack gap="5" className="spacing-top--large spacing-bottom--xlarge">
          <HStack gap="3">
            <Link as={NextLink} href="/" variant="subtle">
              Alle hjelpemiddel
            </Link>
            <BodyShort textColor="subtle">/</BodyShort>
          </HStack>
          <Heading level="1" size="large">
            {agreement.title}
          </Heading>
        </VStack>
        <AgreementSearch agreement={agreement} />
      </VStack>
    </Suspense>
  )
}
