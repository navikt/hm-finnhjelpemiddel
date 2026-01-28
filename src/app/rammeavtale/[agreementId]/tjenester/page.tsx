import { Metadata } from 'next'
import { mapAgreementFromDoc } from '@/utils/agreement-util'
import { getAgreement } from '@/utils/api-util'
import { PartsPage } from '@/app/deler/PartsPage'
import { TjenesterPage } from '@/app/tjenester/TjenesterPage'

type Props = {
  params: Promise<{ agreementId: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const agreementId = params.agreementId
  const agreement = mapAgreementFromDoc(await getAgreement(agreementId))

  return {
    title: agreement.title,
    description: `Tjenester under avtale ${agreement.title} med Nav`,
  }
}

export default async function TjenesterForAvtalePage(props: Props) {
  const params = await props.params
  const title = mapAgreementFromDoc(await getAgreement(params.agreementId)).title

  return (
    params.agreementId && (
      <TjenesterPage
        agreementId={params.agreementId}
        backLink={`/rammeavtale/hjelpemidler/${params.agreementId}`}
        isAgreement={true}
        title={title}
      />
    )
  )
}
