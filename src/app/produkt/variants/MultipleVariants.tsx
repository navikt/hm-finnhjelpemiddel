'use client'

import { Product } from '@/utils/product-util'
import { VariantView } from '@/app/produkt/variants/VariantView'

export type SortColumns = {
  orderBy: string | null
  direction: 'ascending' | 'descending'
}

const MultipleVariants = ({ product }: { product: Product }) => {
  return (
    <>
      <VariantView product={product} />
    </>
  )
}

export default MultipleVariants
