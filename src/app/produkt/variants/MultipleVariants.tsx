'use client'

import { Product } from '@/utils/product-util'
import { SharedVariantDataTable } from '@/app/produkt/variants/SharedVariantDataTable'
import MultipleVariantsTable from '@/app/produkt/variants/MultipleVariantsTable'
import { VariantView } from '@/app/produkt/variants/VariantView'

export type SortColumns = {
  orderBy: string | null
  direction: 'ascending' | 'descending'
}

const MultipleVariants = ({ product }: { product: Product }) => {
  return (
    <>
      <SharedVariantDataTable product={product} />
      <VariantView product={product} />
    </>
  )
}

export default MultipleVariants
