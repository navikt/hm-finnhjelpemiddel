import { Button, Table } from '@navikt/ds-react'
import { ProductVariant } from '@/utils/product-util'
import { SortColumns } from '@/app/produkt/variants/MultipleVariants'
import { ReactNode } from 'react'

interface Props {
  variants: ProductVariant[]
  sortColumns: SortColumns
  handleSortRow: (key: string) => void
  variantNameElementRef: React.RefObject<HTMLTableCellElement>
  iconBasedOnState: (key: string) => ReactNode
}

export const VariantNameRow = ({
  variants,
  sortColumns,
  handleSortRow,
  variantNameElementRef,
  iconBasedOnState,
}: Props) => {
  return (
    <Table.Row className="variants-table__sortable-row">
      <Table.ColumnHeader className="sortable" ref={variantNameElementRef}>
        <Button
          className="sort-button"
          aria-label="Sort by variant name"
          aria-pressed={sortColumns.orderBy === 'artName'}
          size="xsmall"
          style={{ textAlign: 'left' }}
          variant="tertiary"
          onClick={() => handleSortRow('artName')}
          iconPosition="right"
          icon={iconBasedOnState('artName')}
        >
          Navn på variant
        </Button>
      </Table.ColumnHeader>
      {variants.map((variant) => (
        <Table.ColumnHeader key={'artname-' + variant.id}>{variant.articleName}</Table.ColumnHeader>
      ))}
    </Table.Row>
  )
}
