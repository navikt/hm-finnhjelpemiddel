import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { mapAgreementFromDoc } from '@/utils/agreement-util'
import { getAgreement } from '@/utils/api-util'
import SpareParts from '@/app/rammeavtale/[agreementId]/reservedeler/SpareParts'

type Props = {
  params: { agreementId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const agreementId = params.agreementId
  const agreement = mapAgreementFromDoc(await getAgreement(agreementId))
  // Data vil cashes og blir ikke hentet på nytt på produktsiden: https://nextjs.org/docs/app/building-your-application/optimizing/metadata

  //TODO: må ha fornuftig tittel
  return {
    title: agreement.label,
    description: `Produkter under avtale ${agreement.title} med NAV`,
  }
}

export default async function AccessoriesPage({ params }: Props) {
  const agreement = mapAgreementFromDoc(await getAgreement(params.agreementId))

  return <SpareParts agreement={agreement} />
}