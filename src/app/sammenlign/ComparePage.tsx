'use client'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

import useSWR from 'swr'

import { fetchProductsWithVariants, FetchSeriesResponse } from '@/utils/api-util'
import { CompareMenuState, useHydratedCompareStore } from '@/utils/global-state-util'
import { Product } from '@/utils/product-util'
import {
  findUniqueStringValues,
  formatAgreementPosts,
  formatAgreementRanks,
  toValueAndUnit,
  tryParseNumber,
} from '@/utils/string-util'

import { BodyLong, ChevronRightIcon, Heading, Link, Loader, Table } from '@/components/aksel-client'
import ProductCard from '@/components/ProductCard'
import { ArrowLeftIcon } from '@navikt/aksel-icons'
import { useEffect, useState } from 'react'

export default function ComparePage() {
  const { productsToCompare, setCompareMenuState } = useHydratedCompareStore()
  const router = useRouter()
  const [shouldFetch, setShouldFetch] = useState(true)

  const seriesIDsToCompare = productsToCompare.map((product) => product.id)

  const { data, isLoading } = useSWR<FetchSeriesResponse>(
    shouldFetch ? seriesIDsToCompare : null,
    fetchProductsWithVariants,
    { keepPreviousData: true }
  )

  useEffect(() => {
    // Check if all products to compare are already fetched
    const allProductsFetched = seriesIDsToCompare.every((serieId) =>
      data?.products.some((product) => product.id === serieId)
    )
    setShouldFetch(!allProductsFetched)
  }, [seriesIDsToCompare, data])

  // Filter out the products from SWR data that are not present in productsToCompare
  const filteredData = data && {
    ...data,
    products: data.products.filter((product) => seriesIDsToCompare.includes(product.id)),
  }

  const productsToCompareWithVariants: Product[] | undefined = filteredData?.products
  const sortedProductsToCompare =
    productsToCompareWithVariants && sortProductsOnAgreementPostAndRank(productsToCompareWithVariants)

  const handleClick = (event: any) => {
    event.preventDefault()
    setCompareMenuState(CompareMenuState.Open)
    router.back()
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
    <div className="main-wrapper--xlarge compare-page spacing-top--large spacing-bottom--xlarge">
      <Heading level="1" size="large" spacing>
        Sammenlign produkter
      </Heading>

      {sortedProductsToCompare && sortedProductsToCompare.length === 0 ? (
        <section>
          <NextLink
            className="navds-panel navds-link-panel navds-panel--border"
            style={{ maxWidth: '750px' }}
            href={'/sok'}
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
      ) : (
        <>{sortedProductsToCompare && <CompareTable productsToCompare={sortedProductsToCompare} />}</>
      )}
    </div>
  )
}

const CompareTable = ({ productsToCompare }: { productsToCompare: Product[] }) => {
  const router = useRouter()

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
    <section>
      <Link as={NextLink} href="" onClick={() => router.back()}>
        <ArrowLeftIcon fontSize="1.5rem" aria-hidden />
        Legg til flere produkter
      </Link>
      <div className="compare-table-container">
        <Table zebraStripes>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader className="common_headercell"></Table.ColumnHeader>
              {productsToCompare.map((product) => (
                <Table.ColumnHeader className="header" key={'id-' + product.id}>
                  <ProductCard product={product} type="removable" />
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.HeaderCell className="side_header">Rangering</Table.HeaderCell>
              {productsToCompare.map((product) => {
                return (
                  <Table.DataCell key={product.id}>{formatAgreementRanks(product.agreements || [])}</Table.DataCell>
                )
              })}
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell className="side_header">Delkontrakt</Table.HeaderCell>
              {productsToCompare.map((product) => {
                return (
                  <Table.DataCell key={product.id}>{formatAgreementPosts(product.agreements || [])}</Table.DataCell>
                )
              })}
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell className="side_header">Antall varianter</Table.HeaderCell>
              {productsToCompare.map((product) => (
                <Table.DataCell key={product.id}>{product.variantCount}</Table.DataCell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell className="side_header">HMS-nummer</Table.HeaderCell>
              {productsToCompare.map((product) => (
                <Table.DataCell key={product.id}>
                  {product.variantCount > 1 ? 'Flere HMS-nummer' : product.variants[0].hmsArtNr}
                </Table.DataCell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell className="side_header">Leverandør</Table.HeaderCell>
              {productsToCompare.map((product) => (
                <Table.DataCell key={product.id}>{product.supplierName}</Table.DataCell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell className="side_header">
                <Heading level="2" size="medium">
                  Tekniske egenskaper
                </Heading>
              </Table.HeaderCell>
              {productsToCompare.length > 1 && <Table.DataCell colSpan={productsToCompare.length + 1}></Table.DataCell>}
            </Table.Row>

            {allDataKeysVariants.map((key, i) => (
              <Table.Row key={i}>
                <Table.HeaderCell className="side_header">{key}</Table.HeaderCell>
                {productsToCompare.map((product) => (
                  <Table.DataCell key={key + product.id}>{productRowKeyValue[product.id][key]}</Table.DataCell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </section>
  )
}

function sortProductsOnAgreementPostAndRank(products: Product[]): Product[] {
  return products.sort((a, b) => {
    if (a.agreements.length === 0 && b.agreements.length === 0) {
      return 0
    } else if (a.agreements.length === 0) {
      return 1 // Place products without agreements after products with agreements
    } else if (b.agreements.length === 0) {
      return -1 // Place products without agreements after products with agreements
    } else {
      // Both products have agreements, sort by postNumber, then rank
      const postNumberComparison = a.agreements[0].postNr - b.agreements[0].postNr
      if (postNumberComparison !== 0) {
        return postNumberComparison
      } else {
        return a.agreements[0].rank - b.agreements[0].rank
      }
    }
  })
}
