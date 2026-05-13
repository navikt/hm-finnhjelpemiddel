'use client'

import { Product } from '@/utils/product-util'
import {
  findUniqueStringValues,
  formatAgreementPosts,
  formatAgreementRanks,
  toValueAndUnit,
  tryParseNumber,
} from '@/utils/string-util'
import { Heading, Table } from '@/components/aksel-client'
import ProductCardCompare from '@/components/ProductCardCompare'
import { Description } from '@/app/produkt/[id]/GeneralProductInformation'

export const CompareTable = ({ productsToCompare }: { productsToCompare: Product[] }) => {
  //const router = useRouter()

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
    <div className="compare-table-container">
      <Table zebraStripes>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader className="common_headercell"></Table.ColumnHeader>
            {productsToCompare.map((product) => (
              <Table.ColumnHeader className="header" key={'id-' + product.id}>
                <ProductCardCompare product={product} type="removable" />
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.HeaderCell className="side_header">Beskrivelse</Table.HeaderCell>
            {productsToCompare.map((product) => {
              return (
                <Table.DataCell key={product.id}>
                  {<Description description={product.attributes.text} />}
                </Table.DataCell>
              )
            })}
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell className="side_header">Rangering</Table.HeaderCell>
            {productsToCompare.map((product) => {
              return <Table.DataCell key={product.id}>{formatAgreementRanks(product.agreements || [])}</Table.DataCell>
            })}
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell className="side_header">Delkontrakt</Table.HeaderCell>
            {productsToCompare.map((product) => {
              return <Table.DataCell key={product.id}>{formatAgreementPosts(product.agreements || [])}</Table.DataCell>
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
  )
}
