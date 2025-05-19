'use client'

import { ProductVariant } from '@/utils/product-util'
import { CopyButton, Heading, Table, Tag } from '@navikt/ds-react'
import { RefObject, useEffect, useState } from 'react'
import { ThumbUpIcon } from '@navikt/aksel-icons'
import { logActionEvent } from '@/utils/amplitude'
import { viewAgreementRanks } from '@/components/AgreementIcon'
import { formatAgreementPosts } from '@/utils/string-util'
import { default as Link } from 'next/link'

export interface SingleVariantTableProps {
  variant: ProductVariant
  rows: { [p: string]: string[] }
  variantNameElementRef: RefObject<HTMLTableCellElement>
}

export const SingleVariantTable = ({ variant, rows, variantNameElementRef }: SingleVariantTableProps) => {
  const [variantNameElementHeight, setVariantNameElementHeight] = useState(0)

  useEffect(() => {
    if (variantNameElementRef.current) {
      setVariantNameElementHeight(variantNameElementRef.current.offsetHeight)
    }
  }, [variantNameElementRef])

  return (
    <>
      <Heading level="2" size="large" spacing>
        <Link href={'#egenskaper'} className="product-page__header_anchorLink">
          Egenskaper
        </Link>
      </Heading>
      <div className="variants-table" id="variants-table">
        <Table zebraStripes>
          <Table.Header>
            <Table.Row className="variants-table__status-row">
              <Table.HeaderCell aria-hidden></Table.HeaderCell>
              <Table.HeaderCell key={'onagreement-' + variant.id}>
                {variant.status === 'INACTIVE' ? (
                  <Tag size="small" variant="neutral-moderate" style={{ minWidth: '89px' }}>
                    Utgått
                  </Tag>
                ) : variant.hasAgreement ? (
                  <Tag
                    size="small"
                    variant="neutral-moderate"
                    className="filter-chip__green"
                    style={{ minWidth: '89px' }}
                  >
                    På avtale
                  </Tag>
                ) : (
                  <Tag size="small" variant="neutral-moderate">
                    Ikke på avtale
                  </Tag>
                )}
              </Table.HeaderCell>
            </Table.Row>
            <Table.Row className="variants-table__sortable-row">
              <Table.HeaderCell ref={variantNameElementRef}>Navn på variant</Table.HeaderCell>
              <Table.ColumnHeader key={'artname-' + variant.id}>{variant.articleName}</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.HeaderCell className="hmsnr-header-cell" style={{ top: `${variantNameElementHeight}px` }}>
                HMS-nummer
              </Table.HeaderCell>
              <Table.DataCell
                key={'hms-' + variant.id}
                style={{
                  position: 'sticky',
                  top: `${variantNameElementHeight}px`,
                  zIndex: '1 !important',
                  background: 'rgb(242 243 245)',
                }}
              >
                {variant.hmsArtNr ? (
                  <CopyButton
                    size="small"
                    className="hms-copy-button"
                    copyText={variant.hmsArtNr}
                    text={variant.hmsArtNr}
                    activeText="Kopiert"
                    variant="action"
                    activeIcon={<ThumbUpIcon aria-hidden={true} />}
                    iconPosition="right"
                    onClick={() => logActionEvent('kopier')}
                  />
                ) : (
                  '-'
                )}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell>Lev-artnr</Table.HeaderCell>
              <Table.DataCell key={'supref-' + variant.id}>
                {variant.supplierRef ? (
                  <CopyButton
                    size="small"
                    className="hms-copy-button"
                    copyText={variant.supplierRef}
                    text={variant.supplierRef}
                    activeText="Kopiert"
                    variant="action"
                    activeIcon={<ThumbUpIcon aria-hidden={true} />}
                    iconPosition="right"
                    onClick={() => logActionEvent('kopier')}
                  />
                ) : (
                  '-'
                )}
              </Table.DataCell>
            </Table.Row>
            {variant.agreements?.length > 0 && (
              <>
                <Table.Row>
                  <Table.HeaderCell>Rangering</Table.HeaderCell>
                  <Table.DataCell key={'rank-' + variant.id}>{viewAgreementRanks(variant.agreements)}</Table.DataCell>
                </Table.Row>
                <Table.Row>
                  <Table.HeaderCell>Delkontrakt</Table.HeaderCell>
                  <Table.DataCell key={'post-' + variant.id}>{formatAgreementPosts(variant.agreements)}</Table.DataCell>
                </Table.Row>
              </>
            )}
            <Table.Row>
              <Table.HeaderCell>Bestillingsordning</Table.HeaderCell>
              <Table.DataCell key={'bestillingsordning-' + variant.id}>
                {variant.bestillingsordning ? 'Ja' : 'Nei'}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell>Digital behovsmelding</Table.HeaderCell>
              <Table.DataCell key={'behovsmelding-' + variant.id}>
                {variant.digitalSoknad ? 'Ja' : 'Nei'}
              </Table.DataCell>
            </Table.Row>
            {Object.entries(rows).map(([key, value], i) => (
              <Table.Row key={key}>
                <Table.HeaderCell>{key}</Table.HeaderCell>
                <Table.DataCell key={key + '-' + i}>{value}</Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </>
  )
}
