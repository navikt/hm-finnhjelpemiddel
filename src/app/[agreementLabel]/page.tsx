import { Heading } from '@/components/aksel-client'
import { mapAgreementFromDoc } from '@/utils/agreement-util'
import { getAgreement } from '@/utils/api-util'
import { VStack } from '@navikt/ds-react'
import { Metadata } from 'next'
import AgreementProducts from './AgreementProducts'
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
    <VStack className="main-wrapper--large">
      <Heading level="1" size="large">
        Alle hjelpemiddel
      </Heading>
      <AgreementProducts agreement={agreement} />
    </VStack>
  )
}
