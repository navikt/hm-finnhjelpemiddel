'use client'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

import useSWR from 'swr'

import { FetchSeriesResponse, fetchProductsWithVariants } from '@/utils/api-util'
import { CompareMenuState, useHydratedCompareStore } from '@/utils/compare-state-util'
import { Product, ProductWithVariants, toSearchQueryString } from '@/utils/product-util'
import { useHydratedSearchStore } from '@/utils/search-state-util'
import { findUniqueStringValues, toValueAndUnit, tryParseNumber } from '@/utils/string-util'

import ProductCard from '@/components/ProductCard'
import { BodyShort, ChevronLeftIcon, Heading, LinkPanel, Loader, Table } from '@/components/aksel-client'
import AnimateLayout from '@/components/layout/AnimateLayout'

export default function ComparePage() {
  const { productsToCompare, removeProduct, setCompareMenuState } = useHydratedCompareStore()
  const { searchData } = useHydratedSearchStore()
  const router = useRouter()

  const href = '/sok' + toSearchQueryString(searchData)
  const series = productsToCompare.map((product) => product.seriesId)

  //TODO: error handling
  const { data, error, isLoading } = useSWR<FetchSeriesResponse>(
    series,
    productsToCompare.length > 0 ? fetchProductsWithVariants : null
  )

  const productsToCompareWithVariants: ProductWithVariants[] | undefined = data?.products

  const handleClick = (event: any) => {
    event.preventDefault()
    setCompareMenuState(CompareMenuState.Open)
    router.push(href)
  }

  if (isLoading) {
    return (
      <div className="main-wrapper compare-page">
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
      <div className="main-wrapper compare-page">
        <Heading level="1" size="large" spacing>
          Sammenlign produkter
        </Heading>

        {productsToCompare.length === 0 && (
          <section>
            <LinkPanel href={href} onClick={handleClick} border>
              <LinkPanel.Title>Legg til produkter for sammenligning</LinkPanel.Title>
              <LinkPanel.Description>
                For å kunne sammenligne produkter må de velges til sammenligning på søkesiden
              </LinkPanel.Description>
            </LinkPanel>
          </section>
        )}
        {productsToCompare && productsToCompareWithVariants && (
          <CompareTable
            productsToCompare={productsToCompare}
            productsToCompareWithVariants={productsToCompareWithVariants}
            removeProduct={removeProduct}
            href={href}
          ></CompareTable>
        )}
      </div>
    </AnimateLayout>
  )
}

const CompareTable = ({
  productsToCompare,
  productsToCompareWithVariants,
  removeProduct,
  href,
}: {
  productsToCompare: Product[]
  productsToCompareWithVariants: ProductWithVariants[]
  removeProduct: (product: Product) => void
  href: string
}) => {
  const allDataKeysVariants = [
    ...new Set(
      productsToCompareWithVariants.flatMap((product) =>
        product.variants.flatMap((variant) => Object.keys(variant.techData))
      )
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

  const sortedProductsWithVariantsToCompare = productsToCompare.map(
    (pr) => productsToCompareWithVariants.find((p) => p.id === pr.seriesId)!
  )

  const productRowKeyValue = sortedProductsWithVariantsToCompare.reduce((rowKeyValue, product) => {
    rowKeyValue[product.id] = allDataKeysVariants.reduce((keysVariants, key) => {
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
    }, {} as Record<string, string>)
    return rowKeyValue
  }, {} as Record<string, Record<string, string>>)

  return (
    <section className="comparing-table">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>
              <Heading level="2" size="medium" spacing>
                Produkter
              </Heading>
              <NextLink className="back-to-search" href={href}>
                <ChevronLeftIcon title="Tilbake til søk" />
                <BodyShort>Legg til flere</BodyShort>
              </NextLink>
            </Table.ColumnHeader>
            {productsToCompare.map((product) => (
              <Table.ColumnHeader key={'id-' + product.seriesId}>
                <ProductCard product={product} removeProduct={removeProduct} />
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.HeaderCell>Rangering</Table.HeaderCell>
            {productsToCompare.map((product) => (
              <Table.DataCell key={product.seriesId}>{product.agreementInfo?.rank || '-'}</Table.DataCell>
            ))}
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell>Antall varianter</Table.HeaderCell>
            {sortedProductsWithVariantsToCompare.map((productWithVariants) => (
              <Table.DataCell key={productWithVariants.id}>{productWithVariants.variantCount}</Table.DataCell>
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
                <Table.DataCell key={key + product.seriesId}>
                  {productRowKeyValue[product.seriesId][key]}
                </Table.DataCell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </section>
  )
}

// // <Table.Row key={key + 'row'} className={hasDifferentValues({ row }) ? 'highlight' : ''}>
