'use client'

import { Heading, HGrid, VStack } from '@navikt/ds-react'
import { AgreementInfo, Product } from '@/utils/product-util'
import { ProductInformation } from '@/app/produkt/[id]/ProductInformation'
import { SharedVariantDataTable } from '@/app/produkt/[id]/variantTable/SharedVariantDataTable'
import NextLink from 'next/link'
import styles from './ProductMiddle.module.scss'
import { VariantTableSingle } from '@/app/produkt/[id]/variantTable/VariantTableSingle'

import { useMemo } from 'react'
import { useFeatureFlags } from '@/hooks/useFeatureFlag'
import { WorksWith } from '@/app/produkt/[id]/WorksWith'

const WORKS_WITH_CONFIG = {
  featureFlag: 'finnhjelpemiddel.vis-virker-sammen-med-products',
  agreementIds: new Set(['7ef2ab32-34bd-4eec-92a8-2b5c47b77c78', '47105bc7-10a2-48fc-9ff2-95d6e7bb6b96']),
  agreementTitles: new Set(['Varslingshjelpemidler', 'Hørselshjelpemidler']),
}

const ProductMiddle = ({ product, hmsartnr }: { product: Product; hmsartnr?: string }) => {
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
    <HGrid gap={'20 8'} columns={{ sm: 1, md: 2 }} className={styles.middleContainer} paddingBlock={'6 0'}>
      <div style={{ gridArea: 'box1' }}>
        <ProductInformation product={product} />
      </div>
      <VStack gap={'6'} style={{ gridArea: 'box2' }}>
        {product.agreements.length > 0 && <OtherProductsOnPost agreements={product.agreements} />}

        {worksWithShowConstrain && <WorksWith worksWithSeriesIds={worksWithSeriesIds} />}
      </VStack>
      <div style={{ gridArea: 'box3' }}>
        <>
          {product.variants.length > 1 && (
            <SharedVariantDataTable isoCategory={product.isoCategory} variants={product.variants} />
          )}
          {product.variants.length === 1 && <VariantTableSingle product={product} />}
        </>
      </div>
    </HGrid>
  )
}

const showOtherProductsOnAgreement = ({ agreement, index }: { agreement: AgreementInfo; index: number }) => {
  return (
    <VStack gap={'2'} paddingBlock={'2 4'} key={index}>
      <NextLink href={`/rammeavtale/hjelpemidler/${agreement.id}#${agreement.refNr}`}>{agreement.postTitle}</NextLink>
    </VStack>
  )
}

const OtherProductsOnPost = ({ agreements }: { agreements: AgreementInfo[] }) => {
  const sortedAgreements = [...agreements].sort((a, b) => {
    return b.postNr !== a.postNr ? a.postNr - b.postNr : !a.refNr ? -1 : !b.refNr ? 1 : b.refNr.localeCompare(a.refNr)
  })

  return (
    <VStack gap={'2'} paddingInline={'2 0'}>
      <Heading size={'medium'} level={'2'}>
        Andre hjelpemidler på delkontrakt:
      </Heading>
      {sortedAgreements.length > 0 &&
        sortedAgreements.map((agreement, index) => {
          return showOtherProductsOnAgreement({ agreement: agreement, index })
        })}
    </VStack>
  )
}

export default ProductMiddle
