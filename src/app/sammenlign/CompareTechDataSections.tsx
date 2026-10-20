'use client'

import { CompareTechDataGroupTable } from '@/app/sammenlign/CompareTechDataGroupTable'
import { useFeatureFlags } from '@/hooks/useFeatureFlag'
import type { TechDataRow } from '@/app/produkt/[id]/variantTable/VariantTable'

export type TechDataSection = {
  title: string
  priority: number
  techDataRows: TechDataRow[]
}

export const CompareTechDataSections = ({
  groupedTechDataRows,
  groupedTechDataRows22,
  productCount,
}: {
  groupedTechDataRows: TechDataSection[]
  groupedTechDataRows22: TechDataSection[]
  productCount: number
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
        key={title}
      />
    ))
}
