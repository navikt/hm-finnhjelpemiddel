import { Metadata } from 'next'
import { mapAgreementFromDoc } from '@/utils/agreement-util'
import { getAgreement } from '@/utils/api-util'
import { PartsPage } from '@/app/deler/PartsPage'

type Props = {
  params: Promise<{ agreementId: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const agreementId = params.agreementId
  const agreement = mapAgreementFromDoc(await getAgreement(agreementId))
  // Data vil cashes og blir ikke hentet på nytt på produktsiden: https://nextjs.org/docs/app/building-your-application/optimizing/metadata

  //TODO: må ha fornuftig tittel
  return {
    title: agreement.title,
    description: `Produkter under avtale ${agreement.title} med Nav`,
  }
}

export default async function AccessoriesPartsPage(props: Props) {
  const params = await props.params
  const title = mapAgreementFromDoc(await getAgreement(params.agreementId)).title

  return (
    params.agreementId && (
      <PartsPage
        id={params.agreementId}
        backLink={`/rammeavtale/hjelpemidler/${params.agreementId}`}
        isAgreement={true}
        title={title}
      />
    )
  )
}
