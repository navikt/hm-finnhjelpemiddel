'use client'

import useSWR from 'swr'

import { fetchProductsWithVariant, FetchSeriesResponse } from '@/utils/api-util'
import { Product } from '@/utils/product-util'
import { formatAgreementPosts, formatAgreementRanks, toValueAndUnit } from '@/utils/string-util'

import { Heading, Loader, Table } from '@/components/aksel-client'
import AlternativeProductCard from '@/components/AlternativeProductCard'

interface Props {
  productIdsToCompare: string[]
}

export default function CompareAlternativesHotsakPage({ productIdsToCompare }: Props) {
  const { data, isLoading } = useSWR<FetchSeriesResponse>(productIdsToCompare, fetchProductsWithVariant, {
    keepPreviousData: true,
  })

  const productsToCompareWithVariants: Product[] | undefined = data?.products
  const sortedProductsToCompare =
    productsToCompareWithVariants && sortProductsOnAgreementPostAndRank(productsToCompareWithVariants)

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

  if (!sortedProductsToCompare || sortedProductsToCompare?.length === 0) {
    return (
      <div className="main-wrapper--large compare-page spacing-top--large spacing-bottom--xlarge">
        <Heading level="1" size="large" spacing>
          Sammenlign produkter
        </Heading>
        <p>Ingen produkter å sammenligne.</p>
      </div>
    )
  }

  return (
    <div className="main-wrapper--xlarge compare-page spacing-top--large spacing-bottom--xlarge">
      <Heading level="1" size="large" spacing>
        Sammenlign produkter
      </Heading>
      <>{sortedProductsToCompare && <CompareTable productsToCompare={sortedProductsToCompare} />}</>
    </div>
  )
}

const CompareTable = ({ productsToCompare }: { productsToCompare: Product[] }) => {
  const allDataKeysVariants = [
    ...new Set(
      productsToCompare.flatMap((product) => product.variants.flatMap((variant) => Object.keys(variant.techData)))
    ),
  ].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))

  const productRowKeyValue = productsToCompare.reduce(
    (rowKeyValue, product) => {
      const variant = product.variants[0]
      rowKeyValue[variant.id] = Object.keys(variant.techData).reduce(
        (keysVariants, key) => {
          let value = variant.techData[key].value
          let unit = variant.techData[key].unit || ''

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
      <div className="compare-table-container">
        <Table zebraStripes>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader className="common_headercell"></Table.ColumnHeader>
              {productsToCompare.map((product) => (
                <Table.ColumnHeader className="header" key={'id-' + product.variants[0].id}>
                  <AlternativeProductCard product={product} />
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.HeaderCell className="side_header">Rangering</Table.HeaderCell>
              {productsToCompare.map((product) => {
                return (
                  <Table.DataCell key={product.variants[0].id}>
                    {formatAgreementRanks(product.agreements || [])}
                  </Table.DataCell>
                )
              })}
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell className="side_header">Delkontrakt</Table.HeaderCell>
              {productsToCompare.map((product) => {
                return (
                  <Table.DataCell key={product.variants[0].id}>
                    {formatAgreementPosts(product.agreements || [])}
                  </Table.DataCell>
                )
              })}
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell className="side_header">HMS-nummer</Table.HeaderCell>
              {productsToCompare.map((product) => (
                <Table.DataCell key={product.variants[0].id}>{product.variants[0].hmsArtNr}</Table.DataCell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell className="side_header">Leverandør</Table.HeaderCell>
              {productsToCompare.map((product) => (
                <Table.DataCell key={product.variants[0].id}>{product.supplierName}</Table.DataCell>
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
                  <Table.DataCell key={key + product.variants[0].id}>
                    {productRowKeyValue[product.variants[0].id][key]}
                  </Table.DataCell>
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
