'use client'

import { Product } from "@/utils/product-util";
import { SharedVariantDataTable } from "@/app/produkt/variants/SharedVariantDataTable";
import MultipleVariantsTable from "@/app/produkt/variants/MultipleVariantsTable";

export type SortColumns = {
  orderBy: string | null
  direction: 'ascending' | 'descending'
}

const MultipleVariants = ({ product }: { product: Product }) => {

  return (
    <>
      <SharedVariantDataTable product={product} />
      <MultipleVariantsTable product={product} />
    </>
  )
}

export default MultipleVariants
