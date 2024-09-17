import { mapAgreementFromDoc } from '@/utils/agreement-util'
import { getAgreement } from '@/utils/api-util'
import { Metadata } from 'next'
import { Suspense } from 'react'
import AgreementPage from './AgreementPage'

type Props = {
  params: { agreementId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const agreementId = params.agreementId
  const agreement = mapAgreementFromDoc(await getAgreement(agreementId))
  // Data vil cashes og blir ikke hentet på nytt på produktsiden: https://nextjs.org/docs/app/building-your-application/optimizing/metadata

  //TODO: må ha fornuftig tittel
  return {
    title: agreement.title,
    description: `Produkter under avtale ${agreement.title} med NAV`,
  }
}

export default async function Page({ params }: Props) {
  const agreement = mapAgreementFromDoc(await getAgreement(params.agreementId))
  return (
    <Suspense>
      <AgreementPage agreement={agreement} />
    </Suspense>
  )
}
