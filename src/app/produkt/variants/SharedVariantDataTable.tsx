import { Alert, Box, Heading, Table } from '@navikt/ds-react'
import { default as Link } from 'next/link'

interface SharedVariantDataTableProps {
  commonDataRows: { [key: string]: string }
}

export const SharedVariantDataTable = ({ commonDataRows }: SharedVariantDataTableProps) => {
  return (
    <>
      <Heading level="2" size="large" spacing>
        <Link href={'#felles-egenskaper'} className="product-page__header_anchorLink">
          Egenskaper som er felles for alle varianter i denne serien
        </Link>
      </Heading>
      <Box paddingBlock="4">
        {Object.keys(commonDataRows).length === 0 ? (
          <Alert variant={'info'} inline>
            Ingen felles egenskaper
          </Alert>
        ) : (
          <div className="variants-table-common">
            <Table zebraStripes>
              <Table.Body>
                {Object.entries(commonDataRows).map(([key, row]) => {
                  return (
                    <Table.Row key={key}>
                      <Table.HeaderCell>{key}</Table.HeaderCell>
                      <Table.DataCell>{row}</Table.DataCell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table>
          </div>
        )}
      </Box>
    </>
  )
}
