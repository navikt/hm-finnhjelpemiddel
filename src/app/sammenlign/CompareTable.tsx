import { Product } from '@/utils/product-util'
import { useRouter } from 'next/navigation'
import {
  findUniqueStringValues,
  formatAgreementPosts,
  formatAgreementRanks,
  toValueAndUnit,
  tryParseNumber,
} from '@/utils/string-util'
import { Heading, Link, Table } from '@/components/aksel-client'
import NextLink from 'next/link'
import { ArrowLeftIcon } from '@navikt/aksel-icons'
import ProductCard from '@/components/ProductCard'
import RemovableAlternativeProductCard from '@/components/RemovableAlternativeProductCard'
import AlternativeProductCard from '@/components/AlternativeProductCard'

type CompareTableProps = {
  productsToCompare: Product[]
  isAlternativeProducts?: boolean
  isAlternativeProductsHotsak?: boolean
}
export const CompareTable = ({
  productsToCompare,
  isAlternativeProducts,
  isAlternativeProductsHotsak,
}: CompareTableProps) => {
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

  const productRowKeyValueVariant = productsToCompare.reduce(
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

  const mappedVariants = productsToCompare.flatMap((product) => product.variants)
  const showVariantInfo = !isAlternativeProducts && !isAlternativeProductsHotsak

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
                  {isAlternativeProducts ? (
                    <RemovableAlternativeProductCard product={product} />
                  ) : isAlternativeProductsHotsak ? (
                    <AlternativeProductCard product={product} />
                  ) : (
                    <ProductCard product={product} type="removable" />
                  )}
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
            {showVariantInfo && (
              <Table.Row>
                <Table.HeaderCell className="side_header">Antall varianter</Table.HeaderCell>
                {productsToCompare.map((product) => (
                  <Table.DataCell key={product.id}>{product.variantCount}</Table.DataCell>
                ))}
              </Table.Row>
            )}
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
                  <Table.DataCell key={key + product.id}>
                    {showVariantInfo
                      ? productRowKeyValue[product.id][key]
                      : productRowKeyValueVariant[product.variants[0].id][key]}
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
