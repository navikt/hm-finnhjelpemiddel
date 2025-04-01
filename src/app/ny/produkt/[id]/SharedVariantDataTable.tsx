import { ProductVariant } from '@/utils/product-util'
import { customSort } from '@/app/produkt/variants/variant-utils'
import { toValueAndUnit } from '@/utils/string-util'
import { Alert, Box, Heading, Table, VStack } from '@navikt/ds-react'
import styles from '@/app/ny/produkt/[id]/productmiddle.module.scss'

export const SharedVariantDataTable = ({
  isoCategory,
  variants,
}: {
  isoCategory: string
  variants: ProductVariant[]
}) => {
  const allDataKeys =
    isoCategory === '18301505'
      ? [...new Set(variants.flatMap((variant) => Object.keys(variant.techData)))].sort(customSort)
      : [...new Set(variants.flatMap((variant) => Object.keys(variant.techData)))].sort()
  const commonDataRows: { [key: string]: string } = Object.assign(
    {},
    ...allDataKeys
      .filter((key) =>
        variants.every(
          (variant) => variant.techData[key] && variant.techData[key].value === variants[0].techData[key].value
        )
      )
      .map((key) => ({
        [key]: toValueAndUnit(variants[0].techData[key].value, variants[0].techData[key].unit),
      }))
  )

  return (
    <VStack>
      <Heading level="2" size="medium">
        Felles egenskaper
      </Heading>
      <Box paddingBlock="4">
        {Object.keys(commonDataRows).length === 0 ? (
          <Alert variant={'info'} inline>
            Ingen felles egenskaper
          </Alert>
        ) : (
          <Table className={styles.commonAttributes}>
            <Table.Body>
              {Object.entries(commonDataRows).map(([key, row]) => {
                return (
                  <Table.Row key={key}>
                    <Table.HeaderCell>{key}</Table.HeaderCell>
                    <Table.DataCell>{row}</Table.DataCell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
        )}
      </Box>
    </VStack>
  )
}
