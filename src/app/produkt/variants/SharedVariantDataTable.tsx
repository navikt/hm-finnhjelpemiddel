import { Product } from '@/utils/product-util'
import { Box, Heading, Table } from '@navikt/ds-react'
import { customSort, hasDifferentValues } from '@/app/produkt/variants/variant-utils'
import { toValueAndUnit } from '@/utils/string-util'
import { default as Link } from 'next/link'

interface SharedVariantDataTableProps {
  product: Product
}

export const SharedVariantDataTable = ({ product }: SharedVariantDataTableProps) => {
  const allDataKeys =
    product.isoCategory === '18301505'
      ? [...new Set(product.variants.flatMap((variant) => Object.keys(variant.techData)))].sort(customSort)
      : [...new Set(product.variants.flatMap((variant) => Object.keys(variant.techData)))].sort()

  const rows: { [key: string]: string[] } = Object.assign(
    {},
    ...allDataKeys.map((key) => ({
      [key]: product.variants.map((variant) =>
        variant.techData[key] !== undefined
          ? toValueAndUnit(variant.techData[key].value, variant.techData[key].unit)
          : '-'
      ),
    }))
  )

  const commonDataRows = Object.entries(rows)
    .filter(([_, row]) => !hasDifferentValues({ row }))
    .map(([key, row]) => [key, row[0]])

  return (
    <>
      <Heading level="2" size="large" spacing>
        <Link href={'#felles-egenskaper'} className="product-page__header_anchorLink">
          Egenskaper som er felles for alle varianter i denne serien
        </Link>
      </Heading>
      <Box paddingBlock="4">
        {commonDataRows.length > 0 && (
          <div className="variants-table-common">
            <Table zebraStripes>
              <Table.Body>
                {commonDataRows.map(([key, row]) => {
                  return (
                    <Table.Row key={key}>
                      <Table.HeaderCell>{key}</Table.HeaderCell>
                      <Table.DataCell>{row}</Table.DataCell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table>
          </div>
        )}
      </Box>
    </>
  )
}
