import { Table } from '@navikt/ds-react'
import { AgreementInfo, ProductVariant } from '@/utils/product-util'
import styles from './VariantTable.module.scss'
import { SuccessTag } from '@/components/Tags'

interface VariantRankRowProps {
  variants: ProductVariant[]
  handleColumnClick: (key: number) => void
  selectedColumn: number | null
}

export const VariantRankRow = ({ variants, selectedColumn, handleColumnClick }: VariantRankRowProps) => {
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
        <Table.DataCell
          key={'rank-' + variant.id}
          className={selectedColumn === i ? styles.selectedColumn : ''}
          onClick={() => handleColumnClick(i)}
        >
          <SuccessTag title={'Rangering'}>{text(variant.agreements)}</SuccessTag>
        </Table.DataCell>
      ))}
    </Table.Row>
  )
}
