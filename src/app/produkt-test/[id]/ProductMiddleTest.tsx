'use client'

import { HGrid, VStack } from '@navikt/ds-react'
import { Product, ProductVariant } from '@/utils/product-util'
import { ProductInformation } from '@/app/produkt/[id]/ProductInformation'
import styles from './ProductMiddleTest.module.scss'

import { useMemo } from 'react'
import { useFeatureFlags } from '@/hooks/useFeatureFlag'
import { WorksWith } from '@/app/produkt/[id]/WorksWith'

const WORKS_WITH_CONFIG = {
  featureFlag: 'finnhjelpemiddel.vis-virker-sammen-med-products',
  agreementIds: new Set(['7ef2ab32-34bd-4eec-92a8-2b5c47b77c78', '47105bc7-10a2-48fc-9ff2-95d6e7bb6b96']),
  agreementTitles: new Set(['Varslingshjelpemidler', 'Hørselshjelpemidler']),
}

export const groupTechDataKeys = (variants: ProductVariant[]): { title: string; keys: string[] }[] => {
  const KeyGroups: { title: string; keys: string[] }[] = []

  const allDataLabels = new Map(
    variants.flatMap((variant) => {
      return Object.entries(variant.techData).map(([key, value]) => {
        return [key, { key: key, unit: value.unit }]
      })
    })
  )
  const hasBarteri = Array.from(allDataLabels.keys()).some((key) => /batteri/i.test(key))
  const målOgVekt: string[] = []
  const seteting: string[] = []
  const batteriting: string[] = []
  const armleneting: string[] = []
  const ryggting: string[] = []

  const diverse: string[] = []

  allDataLabels.forEach(function (label, key) {
    if (/sete/i.test(key)) {
      seteting.push(key)
    } else if (/armlene/i.test(key)) {
      armleneting.push(key)
    } else if (/rygg/i.test(key)) {
      ryggting.push(key)
    } else if (['cm', 'tommer', 'kg', 'gram'].includes(label.unit.toLowerCase())) {
      målOgVekt.push(key)
    } else if (/batteri/i.test(key)) {
      batteriting.push(key)
    } else if (hasBarteri && ['volt', 'v', 't', 'Ah'].includes(label.unit.toLowerCase())) {
      batteriting.push(key)
    } else {
      diverse.push(key)
    }
  })

  KeyGroups.push({ title: 'Sete', keys: seteting })
  KeyGroups.push({ title: 'Armlene', keys: armleneting })
  KeyGroups.push({ title: 'Rygg', keys: ryggting })
  KeyGroups.push({ title: 'Batteri', keys: batteriting })
  KeyGroups.push({ title: 'Mål og vekt', keys: målOgVekt })
  KeyGroups.push({ title: 'Diverse', keys: diverse })

  return KeyGroups.filter(({ keys }) => keys.length > 0)
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
