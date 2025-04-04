'use client'

import { Product } from '@/utils/product-util'
import { customSort } from '@/app/produkt/variants/variant-utils'
import { formatAgreementPosts, toValueAndUnit } from '@/utils/string-util'
import { ThumbUpIcon } from '@navikt/aksel-icons'
import { Box, CopyButton, Heading, Table } from '@navikt/ds-react'
import styles from '@/app/ny/produkt/[id]/ProductTop.module.scss'
import variantTable from './VariantTable.module.scss'
import { logActionEvent } from '@/utils/amplitude'
import classNames from 'classnames'
import { viewAgreementRanks } from '@/components/AgreementIcon'

export type TechDataRow = { key: string; value: string; unit: string | undefined }

export const VariantTableSingle = ({ product }: { product: Product }) => {
  const variant = product.variants[0]

  const allDataKeys =
    product.isoCategory === '18301505'
      ? [...new Set(Object.keys(variant.techData))].sort(customSort)
      : [...new Set(Object.keys(variant.techData))].sort()

  const techDataRows: TechDataRow[] = allDataKeys.map((key) => {
    return {
      key: key,
      value:
        variant.techData[key] !== undefined
          ? toValueAndUnit(variant.techData[key].value, variant.techData[key].unit)
          : '-',
      unit: variant.techData[key].unit,
    }
  })

  const rankSet = new Set(product.agreements.map((agr) => agr.rank))
  const postSet = new Set(product.agreements.map((agr) => agr.postNr))

  return (
    <Box>
      <Heading size={'medium'} level={'2'} spacing>
        Egenskaper
      </Heading>
      <div className={variantTable.variantsTable} id="variants-table">
        <Table zebraStripes>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Navn på variant</Table.ColumnHeader>
              <Table.ColumnHeader>{variant.articleName}</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.HeaderCell>HMS-nummer</Table.HeaderCell>
              <Table.DataCell>
                <CopyButton
                  size="small"
                  className={styles.copyButton}
                  copyText={variant.hmsArtNr ?? ''}
                  text={variant.hmsArtNr ?? ''}
                  activeText="kopiert"
                  variant="action"
                  activeIcon={<ThumbUpIcon aria-hidden />}
                  iconPosition="right"
                  onClick={() => logActionEvent('kopier')}
                />
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell>Lev-artnr</Table.HeaderCell>
              <Table.DataCell>
                <CopyButton
                  size="small"
                  className={styles.copyButton}
                  copyText={variant.supplierRef}
                  text={variant.supplierRef}
                  activeText="kopiert"
                  variant="action"
                  activeIcon={<ThumbUpIcon aria-hidden />}
                  iconPosition="right"
                  onClick={() => logActionEvent('kopier')}
                />
              </Table.DataCell>
            </Table.Row>
            {rankSet.size > 1 && (
              <Table.Row className={classNames({ 'variants-table__rank-row-on-agreement': !variant.hasAgreement })}>
                <Table.HeaderCell>Rangering</Table.HeaderCell>
                <Table.DataCell>{viewAgreementRanks(variant.agreements)}</Table.DataCell>
              </Table.Row>
            )}
            {postSet.size > 1 && (
              <Table.Row>
                <Table.HeaderCell>Delkontrakt</Table.HeaderCell>
                <Table.DataCell>{formatAgreementPosts(variant.agreements)}</Table.DataCell>
              </Table.Row>
            )}
            {techDataRows.length > 0 &&
              techDataRows.map(({ key, value }) => {
                return (
                  <Table.Row key={key + 'row'}>
                    <Table.HeaderCell>{key}</Table.HeaderCell>
                    <Table.DataCell>{value}</Table.DataCell>
                  </Table.Row>
                )
              })}
          </Table.Body>
        </Table>
      </div>
    </Box>
  )
}
