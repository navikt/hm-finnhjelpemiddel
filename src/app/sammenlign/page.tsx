'use client'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

import { CompareMenuState, useHydratedCompareStore } from '@/utils/compare-state-util'
import { Product, toSearchQueryString } from '@/utils/product-util'
import { useHydratedSearchStore } from '@/utils/search-state-util'
import { sortAlphabetically } from '@/utils/sort-util'
import { toValueAndUnit } from '@/utils/string-util'

import ProductCard from '@/components/ProductCard'
import { BodyShort, ChevronLeftIcon, Heading, LinkPanel, Table } from '@/components/aksel-client'
import AnimateLayout from '@/components/layout/AnimateLayout'

export default function ComparePage() {
  const { productsToCompare, removeProduct, setCompareMenuState } = useHydratedCompareStore()
  const { searchData } = useHydratedSearchStore()
  const router = useRouter()
  const href = '/sok' + toSearchQueryString(searchData)

  const handleClick = (event: any) => {
    event.preventDefault()
    setCompareMenuState(CompareMenuState.Open)
    router.push(href)
  }

  return (
    <AnimateLayout>
      <div className="main-wrapper compare-page">
        <Heading level="1" size="large" spacing>
          Sammenlign produkter
        </Heading>

        {productsToCompare.length === 0 && (
          <section>
            <LinkPanel href={'/sok' + toSearchQueryString(searchData)} onClick={handleClick} border>
              <LinkPanel.Title>Legg til produkter for sammenligning</LinkPanel.Title>
              <LinkPanel.Description>
                For å kunne sammenligne produkter må de velges til sammenligning på søkesiden
              </LinkPanel.Description>
            </LinkPanel>
          </section>
        )}
        {productsToCompare.length > 0 && (
          <CompareTable productsToCompare={productsToCompare} removeProduct={removeProduct} href={href}></CompareTable>
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
  const allDataKeys = productsToCompare
    .flatMap((prod) => Object.keys(prod.techData))
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((keyA, keyB) => sortAlphabetically(keyA, keyB))

  const rows: { [key: string]: string[] } = Object.assign(
    {},
    ...allDataKeys.map((key) => ({
      [key]: productsToCompare.map((product) =>
        product.techData[key] !== undefined
          ? toValueAndUnit(product.techData[key].value, product.techData[key].unit)
          : '-'
      ),
    }))
  )

  const hasDifferentValues = ({ row }: { row: string[] }) => {
    let uniqueValues = new Set(row)
    uniqueValues.delete('-')
    return uniqueValues.size > 1
  }

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
            {productsToCompare.length > 0 &&
              productsToCompare.map((product) => (
                <Table.ColumnHeader key={'id-' + product.id}>
                  <ProductCard product={product} removeProduct={removeProduct} />
                </Table.ColumnHeader>
              ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.DataCell colSpan={2}>
              <Heading level="2" size="medium">
                Tekniske egenskaper
              </Heading>
            </Table.DataCell>
            {productsToCompare.length > 1 && <Table.DataCell colSpan={productsToCompare.length - 1}></Table.DataCell>}
          </Table.Row>
          {productsToCompare.length > 0 &&
            Object.entries(rows).map(([key, row]) => (
              <Table.Row key={key + 'row'} className={hasDifferentValues({ row }) ? 'highlight' : ''}>
                <Table.HeaderCell>{key}</Table.HeaderCell>
                {row.map((value, i) => (
                  <Table.DataCell key={key + '-' + i}>{value}</Table.DataCell>
                ))}
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </section>
  )
}