import { Metadata } from 'next'

import Accessories from '@/app/rammeavtale/[agreementId]/tilbehor/Accessories'
import { mapAgreementFromDoc } from '@/utils/agreement-util'
import { getAgreement } from '@/utils/api-util'

type Props = {
  params: Promise<{ agreementId: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const agreementId = params.agreementId
  const agreement = mapAgreementFromDoc(await getAgreement(agreementId))
  // Data vil cashes og blir ikke hentet på nytt på produktsiden: https://nextjs.org/docs/app/building-your-application/optimizing/metadata

  //TODO: må ha fornuftig tittel
  return {
    title: agreement.title,
    description: `Produkter under avtale ${agreement.title} med Nav`,
  }
}

export default async function AccessoriesPage(props: Props) {
  const params = await props.params;
  const agreement = mapAgreementFromDoc(await getAgreement(params.agreementId))

  return <Accessories agreement={agreement} />
}
