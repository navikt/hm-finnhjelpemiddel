import { mapAgreementFromDoc } from '@/utils/agreement-util'
import { getAgreement } from '@/utils/api-util'
import { VStack } from '@navikt/ds-react'
import { Metadata } from 'next'
import { Suspense } from 'react'
import AgreementSearch from './AgreementSearch'
import Header from './Header'
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
      <VStack className="main-wrapper--large spacing-bottom--large">
        <Header agreementTitle={agreement.title} />
        <AgreementSearch agreement={agreement} />
      </VStack>
    </Suspense>
  )
}
