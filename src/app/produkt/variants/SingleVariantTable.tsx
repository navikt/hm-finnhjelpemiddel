'use client'

import { ProductVariant } from "@/utils/product-util";
import { CopyButton, Table, Tag } from "@navikt/ds-react";
import { useEffect, useRef, useState } from "react";
import { ThumbUpIcon } from "@navikt/aksel-icons";
import { logActionEvent } from "@/utils/amplitude";
import { viewAgreementRanks } from "@/components/AgreementIcon";
import { formatAgreementPosts, toValueAndUnit } from "@/utils/string-util";


export interface SingleVariantTableProps {
  variant: ProductVariant
}

export const SingleVariantTable = ({ variant }: SingleVariantTableProps) => {

  const variantNameElementRef = useRef<HTMLTableCellElement>(null)
  const [variantNameElementHeight, setVariantNameElementHeight] = useState(0)

  useEffect(() => {
    if (variantNameElementRef.current) {
      setVariantNameElementHeight(variantNameElementRef.current.offsetHeight)
    }
  }, [])

  const handleResize = () => {
    if (variantNameElementRef.current) {
      setVariantNameElementHeight(variantNameElementRef.current.offsetHeight)
    }
  }

  // Teknisk data
  const allDataKeys = Object.keys(variant.techData).sort();
  const rows: { [key: string]: string } = allDataKeys.reduce<{ [key: string]: string }>((acc, key) => {
    acc[key] = variant.techData[key] !== undefined
      ? toValueAndUnit(variant.techData[key].value, variant.techData[key].unit)
      : '-';
    return acc;
  }, {});

  return (
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
            <Table.HeaderCell  ref={variantNameElementRef}>Navn på variant</Table.HeaderCell>
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


  )


}
