'use client'

import type { TechDataRow } from '@/app/produkt/[id]/variantTable/VariantTable'
import { CompareTechDataGroupTable } from '@/app/sammenlign/CompareTechDataGroupTable'

import { useFeatureFlags } from '@/hooks/useFeatureFlag'

export type TechDataSection = {
  title: string
  priority: number
  techDataRows: TechDataRow[]
}

export const CompareTechDataSections = ({
  groupedTechDataRows,
  groupedTechDataRows22,
  productCount,
  productBoundaries,
}: {
  groupedTechDataRows: TechDataSection[]
  groupedTechDataRows22: TechDataSection[]
  productCount: number
  productBoundaries: number[]
}) => {
  const { isEnabled } = useFeatureFlags()
  const sections = isEnabled('finnhjelpemiddel.iso22') ? groupedTechDataRows22 : groupedTechDataRows

  return [...sections]
    .sort((a, b) => a.priority - b.priority)
    .map(({ title, techDataRows }) => (
      <CompareTechDataGroupTable
        title={title}
        techDataRows={techDataRows}
        productCount={productCount}
        productBoundaries={productBoundaries}
        key={title}
      />
    ))
}
