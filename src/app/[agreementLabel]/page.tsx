import { Heading } from '@/components/aksel-client'
import { mapAgreementFromDoc } from '@/utils/agreement-util'
import { getAgreement } from '@/utils/api-util'
import { BodyShort, VStack } from '@navikt/ds-react'
import { Metadata } from 'next'
import { Suspense } from 'react'
import AgreementSearch from './AgreementSearch'
type Props = {
  params: { agreementLabel: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const agreementLabel = params.agreementLabel
  // Data vil cashes og blir ikke hentet på nytt på produktsiden: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
  //   const agreement = mapAgreementFromSearch(await getAgreementFromLabel(agreementLabel))

  return {
    title: agreementLabel,
    description: agreementLabel,
  }
}

export default async function AgreementPage({ params }: Props) {
  const agreement = mapAgreementFromDoc(await getAgreement(params.agreementLabel))
  return (
    <Suspense>
      <VStack className="main-wrapper--large">
        <VStack gap="5" className="spacing-vertical--large">
          <BodyShort textColor="subtle">Alle hjelpemiddel /</BodyShort>
          <Heading level="1" size="large">
            {agreement.title}
          </Heading>
        </VStack>
        <AgreementSearch agreement={agreement} />
      </VStack>
    </Suspense>
  )
}
