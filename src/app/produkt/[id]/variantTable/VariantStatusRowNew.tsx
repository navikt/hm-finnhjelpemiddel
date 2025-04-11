import { Table, Tag } from '@navikt/ds-react'
import { ProductVariant } from '@/utils/product-util'
import styles from './VariantTable.module.scss'

export const VariantStatusRowNew = ({ variants }: { variants: ProductVariant[] }) => (
  <Table.Row className={styles.statusRow}>
    <Table.HeaderCell aria-hidden></Table.HeaderCell>
    {variants.map((variant) => (
      <Table.HeaderCell key={'onagreement-' + variant.id}>
        {variant.status === 'INACTIVE' ? (
          <Tag size="small" variant="neutral-moderate" style={{ minWidth: '89px' }}>
            Utgått
          </Tag>
        ) : variant.hasAgreement ? (
          <Tag size="small" variant="neutral-moderate" className={styles.agreementTag} style={{ minWidth: '89px' }}>
            På avtale
          </Tag>
        ) : (
          <Tag size="small" variant="neutral-moderate">
            Ikke på avtale
          </Tag>
        )}
      </Table.HeaderCell>
    ))}
  </Table.Row>
)
