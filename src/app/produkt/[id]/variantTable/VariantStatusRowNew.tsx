import { Table } from '@navikt/ds-react'
import { ProductVariant } from '@/utils/product-util'
import styles from './VariantTable.module.scss'
import { NeutralTag, SuccessTag } from '@/components/Tags'

export const VariantStatusRowNew = ({ variants }: { variants: ProductVariant[] }) => (
  <Table.Row className={styles.statusRow}>
    <Table.HeaderCell aria-hidden></Table.HeaderCell>
    {variants.map((variant) => (
      <Table.HeaderCell key={'onagreement-' + variant.id}>
        {variant.status === 'INACTIVE' ? (
          <NeutralTag>Utgått</NeutralTag>
        ) : variant.hasAgreement ? (
          <SuccessTag>På avtale</SuccessTag>
        ) : (
          <NeutralTag>Ikke på avtale</NeutralTag>
        )}
      </Table.HeaderCell>
    ))}
  </Table.Row>
)
