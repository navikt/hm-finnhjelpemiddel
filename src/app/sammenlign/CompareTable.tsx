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
import {
  TableBody,
  TableColumnHeader,
  TableDataCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@navikt/ds-react/Table'

export const CompareTable = ({ productsToCompare }: { productsToCompare: Product[] }) => {
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
        <TableHeader>
          <TableRow>
            <TableColumnHeader className="common_headercell"></TableColumnHeader>
            {productsToCompare.map((product) => (
              <TableColumnHeader className="header" key={'id-' + product.id}>
                <ProductCardCompare product={product} type="removable" />
              </TableColumnHeader>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableHeaderCell className="side_header">Beskrivelse</TableHeaderCell>
            {productsToCompare.map((product) => {
              return (
                <TableDataCell key={product.id}>{<Description description={product.attributes.text} />}</TableDataCell>
              )
            })}
          </TableRow>
          <TableRow>
            <TableHeaderCell className="side_header">Rangering</TableHeaderCell>
            {productsToCompare.map((product) => {
              return <TableDataCell key={product.id}>{formatAgreementRanks(product.agreements || [])}</TableDataCell>
            })}
          </TableRow>
          <TableRow>
            <TableHeaderCell className="side_header">Delkontrakt</TableHeaderCell>
            {productsToCompare.map((product) => {
              return <TableDataCell key={product.id}>{formatAgreementPosts(product.agreements || [])}</TableDataCell>
            })}
          </TableRow>
          <TableRow>
            <TableHeaderCell className="side_header">Antall varianter</TableHeaderCell>
            {productsToCompare.map((product) => (
              <TableDataCell key={product.id}>{product.variantCount}</TableDataCell>
            ))}
          </TableRow>
          <TableRow>
            <TableHeaderCell className="side_header">HMS-nummer</TableHeaderCell>
            {productsToCompare.map((product) => (
              <TableDataCell key={product.id}>
                {product.variantCount > 1 ? 'Flere HMS-nummer' : product.variants[0].hmsArtNr}
              </TableDataCell>
            ))}
          </TableRow>
          <TableRow>
            <TableHeaderCell className="side_header">Leverandør</TableHeaderCell>
            {productsToCompare.map((product) => (
              <TableDataCell key={product.id}>{product.supplierName}</TableDataCell>
            ))}
          </TableRow>
          <TableRow>
            <TableHeaderCell className="side_header">
              <Heading level="2" size="medium">
                Tekniske egenskaper
              </Heading>
            </TableHeaderCell>
            {productsToCompare.length > 1 && <TableDataCell colSpan={productsToCompare.length + 1}></TableDataCell>}
          </TableRow>

          {allDataKeysVariants.map((key, i) => (
            <TableRow key={i}>
              <TableHeaderCell className="side_header">{key}</TableHeaderCell>
              {productsToCompare.map((product) => (
                <TableDataCell key={key + product.id}>{productRowKeyValue[product.id][key]}</TableDataCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
