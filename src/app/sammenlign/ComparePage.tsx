'use client'

import NextLink from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import useSWR from 'swr'

import { fetchProductsWithVariants, FetchSeriesResponse } from '@/utils/api-util'
import { CompareMenuState, useHydratedCompareStore } from '@/utils/global-state-util'
import { mapSearchParams, Product, toSearchQueryString } from '@/utils/product-util'
import { findUniqueStringValues, formatAgreementRanks, toValueAndUnit, tryParseNumber } from '@/utils/string-util'

import { BodyLong, ChevronRightIcon, Heading, Loader, Table } from '@/components/aksel-client'
import AnimateLayout from '@/components/layout/AnimateLayout'
import ProductCard from '@/components/ProductCard'
import { useMemo } from 'react'

export default function ComparePage() {
  //På sammenligningssiden: flatmappe alle avtaler og skrive ut unike rankringer.
  const { productsToCompare, removeProduct, setCompareMenuState } = useHydratedCompareStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchData = useMemo(() => mapSearchParams(searchParams), [searchParams])

  const href = '/sok?' + toSearchQueryString(searchData)
  const series = productsToCompare.map((product) => product.id)

  //TODO: error handling
  const { data, error, isLoading } = useSWR<FetchSeriesResponse>(
    series,
    productsToCompare.length > 0 ? fetchProductsWithVariants : null,
    // Må sendes inn for å fikse typescript feil, open issue her: https://github.com/vercel/swr/issues/2826
    {}
  )

  const productsToCompareWithVariants: Product[] | undefined = data?.products

  const handleClick = (event: any) => {
    event.preventDefault()
    setCompareMenuState(CompareMenuState.Open)
    router.push(href)
  }

  if (isLoading) {
    return (
      <div className="main-wrapper--large compare-page spacing-top--large spacing-bottom--xlarge">
        <Heading level="1" size="large" spacing>
          Sammenlign produkter
        </Heading>

        <div id="searchResults" className="results__loader">
          <Loader size="3xlarge" title="Laster produkter" />
        </div>
      </div>
    )
  }

  return (
    <AnimateLayout>
      <div className="main-wrapper--large compare-page spacing-top--large spacing-bottom--xlarge">
        <Heading level="1" size="large" spacing>
          Sammenlign produkter
        </Heading>

        {productsToCompare.length === 0 && (
          <section>
            <NextLink
              className="navds-panel navds-link-panel navds-panel--border"
              style={{ maxWidth: '750px' }}
              href={href}
              onClick={handleClick}
            >
              <div className="navds-link-panel__content">
                <div className="navds-link-panel__title navds-heading navds-heading--medium">
                  Legg til produkter for sammenligning
                </div>
                <BodyLong>For å kunne sammenligne produkter må de velges til sammenligning på søkesiden</BodyLong>
              </div>
              <ChevronRightIcon aria-hidden />
            </NextLink>
          </section>
        )}
        {productsToCompareWithVariants && (
          <CompareTable productsToCompare={productsToCompareWithVariants} removeProduct={removeProduct} href={href} />
        )}
      </div>
    </AnimateLayout>
  )
}

const CompareTable = ({
  productsToCompare,
  removeProduct,
  href,
}: {
  productsToCompare: Product[]
  removeProduct: (product: Product) => void
  href: string
}) => {
  const allDataKeysVariants = [
    ...new Set(
      productsToCompare.flatMap((product) => product.variants.flatMap((variant) => Object.keys(variant.techData)))
    ),
  ].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))

  const findValueRangeForProductRowKey = (values: string[]) => {
    if (values.length === 0) return

    if (values.some((value) => isNaN(tryParseNumber(value)))) {
      return findUniqueStringValues(values)
    }

    const numberList = values.map(tryParseNumber)
    const min = Math.min(...numberList)
    const max = Math.max(...numberList)
    if (min === max) return String(min)
    return `${min} - ${max}`
  }

  const productRowKeyValue = productsToCompare.reduce(
    (rowKeyValue, product) => {
      rowKeyValue[product.id] = allDataKeysVariants.reduce(
        (keysVariants, key) => {
          const values = product.variants
            .filter((variant) => key in variant.techData)
            .map((variant) => variant.techData[key].value)

          let unit = product.variants.find((p) => key in p.techData)?.techData[key].unit || ''

          let value = findValueRangeForProductRowKey(values)
          if (key.includes('intervall') && value === '0') {
            value = '-'
            unit = ''
          }

          keysVariants[key] = value ? (unit ? toValueAndUnit(value, unit) : value) : '-'
          return keysVariants
        },
        {} as Record<string, string>
      )
      return rowKeyValue
    },
    {} as Record<string, Record<string, string>>
  )

  return (
    <section className="comparing-table">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader></Table.ColumnHeader>
            {productsToCompare.map((product) => (
              <Table.ColumnHeader key={'id-' + product.id}>
                <ProductCard product={product} removeProduct={removeProduct} />
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.HeaderCell>Rangering</Table.HeaderCell>
            {productsToCompare.map((product) => {
              return <Table.DataCell key={product.id}>{formatAgreementRanks(product.agreements || [])}</Table.DataCell>
            })}
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell>Antall varianter</Table.HeaderCell>
            {productsToCompare.map((product) => (
              <Table.DataCell key={product.id}>{product.variantCount}</Table.DataCell>
            ))}
          </Table.Row>

          <Table.Row>
            <Table.DataCell>
              <Heading level="2" size="medium">
                Tekniske egenskaper
              </Heading>
            </Table.DataCell>
            {productsToCompare.length > 1 && <Table.DataCell colSpan={productsToCompare.length + 1}></Table.DataCell>}
          </Table.Row>

          {allDataKeysVariants.map((key, i) => (
            <Table.Row key={i}>
              <Table.HeaderCell>{key}</Table.HeaderCell>
              {productsToCompare.map((product) => (
                <Table.DataCell key={key + product.id}>{productRowKeyValue[product.id][key]}</Table.DataCell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </section>
  )
}
