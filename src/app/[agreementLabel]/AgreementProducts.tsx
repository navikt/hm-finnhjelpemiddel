'use client'

import { mapAgreementFromSearch } from '@/utils/agreement-util'
import { getProductsOnAgreement } from '@/utils/api-util'
// import { getAgreementFromLabel } from '@/utils/api-util'
import type { Metadata } from 'next'
import useSWR from 'swr'

const AgreementProducts = ({ agreementLabel }: { agreementLabel: string }) => {
  console.log('agreementLabel', agreementLabel)

  //   const agreement = mapAgreementFromSearch(await getAgreementFromLabel(agreementLabel))

  //TODO: error handling
  const { data, error, isLoading } = useSWR<any>(agreementLabel, getProductsOnAgreement)
  const products = data
  console.log('data', products)

  return <div></div>
}

export default AgreementProducts
