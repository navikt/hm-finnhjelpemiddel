'use client'

import { Box, Heading, HGrid, Link, Table, VStack } from '@navikt/ds-react'
import { AgreementInfo, Product, ProductVariant } from '@/utils/product-util'
import { ProductInformation } from '@/app/produkt/[id]/ProductInformation'
import NextLink from 'next/link'
import styles from './ProductMiddleTest.module.scss'

import { useMemo } from 'react'
import { useFeatureFlags } from '@/hooks/useFeatureFlag'
import { WorksWith } from '@/app/produkt/[id]/WorksWith'
import { findUniqueStringValues, toValueAndUnit, tryParseNumber } from '@/utils/string-util'

const WORKS_WITH_CONFIG = {
  featureFlag: 'finnhjelpemiddel.vis-virker-sammen-med-products',
  agreementIds: new Set(['7ef2ab32-34bd-4eec-92a8-2b5c47b77c78', '47105bc7-10a2-48fc-9ff2-95d6e7bb6b96']),
  agreementTitles: new Set(['Varslingshjelpemidler', 'Hørselshjelpemidler']),
}

const groupTechDataKeys = (variants: ProductVariant[]): { title: string; keys: string[] }[] => {
  const KeyGroups: { title: string; keys: string[] }[] = []

  const allDataLabels = new Map(
    variants.flatMap((variant) => {
      return Object.entries(variant.techData).map(([key, value]) => {
        return [key, { key: key, unit: value.unit }]
      })
    })
  )

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

  return KeyGroups
}

const findValueRangeForProductRowKey = (values: string[]) => {
  if (values.length === 0) return ''

  if (values.some((value) => isNaN(tryParseNumber(value)))) {
    return findUniqueStringValues(values)
  }

  const numberList = values.map(tryParseNumber)
  const min = Math.min(...numberList)
  const max = Math.max(...numberList)
  if (min === max) return String(min)
  return `${min} - ${max}`
}

const toSummarizedValue = (key: string, variants: ProductVariant[]): string => {
  const values = variants.map((variant) => variant.techData[key].value)

  return findValueRangeForProductRowKey(values)
}

const TechDataTable = ({
  title,
  dataKeys,
  variants,
}: {
  title: string
  dataKeys: string[]
  variants: ProductVariant[]
}) => {
  const dataRows: { [key: string]: string } = Object.assign(
    {},
    ...dataKeys.map((key) => ({
      [key]: toValueAndUnit(toSummarizedValue(key, variants), variants[0].techData[key].unit),
    }))
  )

  if (Object.keys(dataRows).length === 0) {
    return <></>
  }
  return (
    <VStack>
      <Heading level="2" size="medium">
        {title}
      </Heading>
      <Box paddingBlock="space-16">
        <Table className={styles.commonAttributes}>
          <Table.Body>
            {Object.entries(dataRows).map(([key, row]) => {
              return (
                <Table.Row key={key}>
                  <Table.HeaderCell>{key}</Table.HeaderCell>
                  <Table.DataCell>{row}</Table.DataCell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </Box>
    </VStack>
  )
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

  const groupedTechData = groupTechDataKeys(product.variants)

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
        {product.agreements.length > 0 && <OtherProductsOnPost agreements={product.agreements} />}

        {worksWithShowConstrain && <WorksWith worksWithSeriesIds={worksWithSeriesIds} />}
      </VStack>
      <div style={{ gridArea: 'box3' }}>
        <VStack gap={'space-8'}>
          {groupedTechData.map(({ title, keys }) => (
            <TechDataTable key={title} title={title} dataKeys={keys?.sort() ?? []} variants={product.variants} />
          ))}
        </VStack>
      </div>
    </HGrid>
  )
}

const showOtherProductsOnAgreement = ({ agreement, index }: { agreement: AgreementInfo; index: number }) => {
  return (
    <VStack gap={'space-8'} paddingBlock={'space-8 space-16'} key={index}>
      <Link as={NextLink} href={`/rammeavtale/hjelpemidler/${agreement.id}#${agreement.refNr}`}>
        {agreement.postTitle}
      </Link>
    </VStack>
  )
}

const OtherProductsOnPost = ({ agreements }: { agreements: AgreementInfo[] }) => {
  const sortedAgreements = [...agreements].sort((a, b) => {
    return b.postNr !== a.postNr ? a.postNr - b.postNr : !a.refNr ? -1 : !b.refNr ? 1 : b.refNr.localeCompare(a.refNr)
  })

  return (
    <VStack gap={'space-8'} paddingInline={'space-8 space-0'}>
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

export default ProductMiddleTest
