'use client'

import { HGrid, VStack } from '@navikt/ds-react'
import { Product, ProductVariant } from '@/utils/product-util'
import { ProductInformation } from '@/app/produkt/[id]/ProductInformation'
import styles from './ProductMiddleTest.module.scss'

import { useMemo } from 'react'
import { useFeatureFlags } from '@/hooks/useFeatureFlag'
import { WorksWith } from '@/app/produkt/[id]/WorksWith'
import { TechLabelDTO } from '@/utils/techlabel-util'

const WORKS_WITH_CONFIG = {
  featureFlag: 'finnhjelpemiddel.vis-virker-sammen-med-products',
  agreementIds: new Set(['7ef2ab32-34bd-4eec-92a8-2b5c47b77c78', '47105bc7-10a2-48fc-9ff2-95d6e7bb6b96']),
  agreementTitles: new Set(['Varslingshjelpemidler', 'Hørselshjelpemidler']),
}

const DIVERSE_TITLE = 'Diverse'

export const groupTechDataKeys = (
  variants: ProductVariant[],
  techLabels: TechLabelDTO[]
): { title: string; keys: string[] }[] => {
  const techDataKeys = new Set(variants.flatMap((variant) => Object.keys(variant.techData)))

  const labels = techLabels.filter((label) => label.section && techDataKeys.has(label.label)).sort((a, b) => a.sort - b.sort)

  const keysBySection = new Map<string, string[]>()
  const sectionOrderKey = new Map<string, number>()
  const mappedKeys = new Set<string>()

  labels.forEach((label) => {
    if (mappedKeys.has(label.label)) return
    const section = label.section!
    // section order = min(sort) across its labels in that section
    const orderKey = label.sort
    if (!keysBySection.has(section) || orderKey < sectionOrderKey.get(section)!) {
      sectionOrderKey.set(section, orderKey)
    }
    if (!keysBySection.has(section)) {
      keysBySection.set(section, [])
    }
    keysBySection.get(section)!.push(label.label)
    mappedKeys.add(label.label)
  })

  const diverse = Array.from(techDataKeys).filter((key) => !mappedKeys.has(key))

  const sectionOrder = Array.from(keysBySection.keys()).sort(
    (a, b) => sectionOrderKey.get(a)! - sectionOrderKey.get(b)!
  )

  const groups = sectionOrder.map((title) => ({ title, keys: keysBySection.get(title)! }))
  if (diverse.length > 0) {
    groups.push({ title: DIVERSE_TITLE, keys: diverse })
  }

  return groups
}

const ProductMiddleTest = ({ product }: { product: Product }) => {
  const worksWithSeriesIds = product.attributes.worksWith?.seriesIds

  const featureFlags = useFeatureFlags()

  const worksWithFeatureFlag: boolean = featureFlags.isEnabled(WORKS_WITH_CONFIG.featureFlag) ?? false

  const shouldShowSection = useMemo(() => {
    return product.agreements.some(
      (agreement) =>
        WORKS_WITH_CONFIG.agreementIds.has(agreement.id) || WORKS_WITH_CONFIG.agreementTitles.has(agreement.title)
    )
  }, [product.agreements])

  const worksWithShowConstrain = worksWithFeatureFlag && shouldShowSection

  return (
    <HGrid
      gap={'space-80 space-32'}
      columns={{ sm: 1, md: 2 }}
      className={styles.middleContainer}
      paddingBlock={'space-24 space-0'}
    >
      <div style={{ gridArea: 'box1' }}>
        <ProductInformation product={product} />
      </div>
      <VStack gap={'space-24'} style={{ gridArea: 'box2' }}>
        {worksWithShowConstrain && <WorksWith worksWithSeriesIds={worksWithSeriesIds} />}
      </VStack>
    </HGrid>
  )
}

export default ProductMiddleTest
