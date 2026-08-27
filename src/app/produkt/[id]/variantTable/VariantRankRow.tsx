import { Table } from '@navikt/ds-react'

import { AgreementInfo, ProductVariant } from '@/utils/product-util'

import { SuccessTag } from '@/components/Tags'

interface VariantRankRowProps {
  variants: ProductVariant[]
}

export const VariantRankRow = ({ variants }: VariantRankRowProps) => {
  const text = (agreements: AgreementInfo[]) =>
    agreements
      .map((ag) => ag.rank)
      .filter((rank) => rank !== 99)
      .sort()
      .join(', ')

  return (
    <Table.Row>
      <Table.HeaderCell>Rangering</Table.HeaderCell>
      {variants.map((variant, i) => (
        <Table.DataCell key={'rank-' + variant.id}>
          <SuccessTag title={'Rangering'}>{text(variant.agreements)}</SuccessTag>
        </Table.DataCell>
      ))}
    </Table.Row>
  )
}
