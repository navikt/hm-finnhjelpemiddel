import { Table, Tag } from '@navikt/ds-react';
import { ProductVariant } from '@/utils/product-util';

export const VariantStatusRow = ({ variants }: { variants: ProductVariant[] }) => (
  <Table.Row className="variants-table__status-row">
    <Table.HeaderCell aria-hidden></Table.HeaderCell>
    {variants.map((variant) => (
      <Table.HeaderCell key={'onagreement-' + variant.id}>
        {variant.status === 'INACTIVE' ? (
          <Tag size="small" variant="neutral-moderate" style={{ minWidth: '89px' }}>
            Utgått
          </Tag>
        ) : variant.hasAgreement ? (
          <Tag size="small" variant="neutral-moderate" className="filter-chip__green" style={{ minWidth: '89px' }}>
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
);

