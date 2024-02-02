'use client'

import { Agreement } from '@/utils/agreement-util'
import { getProductsOnAgreement } from '@/utils/api-util'
import { AgreementDocResponse } from '@/utils/response-types'
// import { getAgreementFromLabel } from '@/utils/api-util
import useSWR from 'swr'

const AgreementProducts = ({ agreement }: { agreement: Agreement }) => {
  const { data: products, error, isLoading } = useSWR<any>(agreement.id, getProductsOnAgreement)

  console.log('agreement', agreement)
  console.log('products', products)

  return <div></div>
}

export default AgreementProducts
