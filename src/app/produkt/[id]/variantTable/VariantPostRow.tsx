import { Table } from '@navikt/ds-react'

import { ProductVariant } from '@/utils/product-util'
import { formatAgreementPosts } from '@/utils/string-util'

interface VariantPostRowProps {
  variants: ProductVariant[]
}

export const VariantPostRow = ({ variants }: VariantPostRowProps) => {
  return (
    <Table.Row>
      <Table.HeaderCell>Delkontrakt</Table.HeaderCell>
      {variants.map((variant, i) => (
        <Table.DataCell key={'post-' + variant.id}>{formatAgreementPosts(variant.agreements)}</Table.DataCell>
      ))}
    </Table.Row>
  )
}
