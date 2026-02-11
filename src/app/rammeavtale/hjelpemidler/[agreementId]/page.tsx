import { mapAgreementFromDoc } from '@/utils/agreement-util'
import { getAgreement } from '@/utils/api-util'
import { Metadata } from 'next'
import { Suspense } from 'react'
import AgreementPage from './AgreementPage'
import { NotFound } from '@/app/[...not-found]/NotFound'

type Props = {
  params: Promise<{ agreementId: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const agreementId = params.agreementId
  const agreementResponse = await getAgreement(agreementId)
  const agreement = mapAgreementFromDoc(agreementResponse)
  // Data vil cashes og blir ikke hentet på nytt på produktsiden: https://nextjs.org/docs/app/building-your-application/optimizing/metadata

  //TODO: må ha fornuftig tittel
  return {
    title: agreement.title,
    description: `Produkter under avtale ${agreement.title} med Nav`,
  }
}

export default async function Page(props: Props) {
  const params = await props.params
  const agreement = mapAgreementFromDoc(await getAgreement(params.agreementId))
  const activeAgreement = agreement.published <= new Date() && agreement.expired >= new Date()
  return <Suspense>{activeAgreement ? <AgreementPage agreement={agreement} /> : <NotFound />}</Suspense>
}
