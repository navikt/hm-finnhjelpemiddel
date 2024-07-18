'use client'

import {HStack, Pagination, Search, Select, Table } from '@navikt/ds-react'
import styles from "./AccessoriesSparPartsBody.module.scss"

import { Agreement, agreementHasNoProducts } from '@/utils/agreement-util'
import { useState } from 'react'

const AccessoriesSparePartsBody = ({ agreement }: { agreement: Agreement }) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 14;

  console.log(agreement)

  return (
    <>
      <HStack gap="4">
        <form role="search">
          <Search label="Søk alle NAV sine sider" variant="secondary" className={styles.alignFiltration} />
          <Select label="Hvilket land har du bosted i?" className={styles.alignFiltration}>
            <option value="">Velg land</option>
            <option value="norge">Norge</option>
            <option value="sverige">Sverige</option>
            {/*<option value="danmark">Danmark</option>  //Bytte options med map*/}
          </Select>
        </form>
      </HStack>
      <Table zebraStripes>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">HMS-nummer</Table.HeaderCell>
            <Table.HeaderCell scope="col">Beskrivelse</Table.HeaderCell>
            <Table.HeaderCell scope="col">Leverandør artikkelnummer</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
              <Table.Row>
                <Table.HeaderCell scope="row">
                  Test
                </Table.HeaderCell>
                <Table.HeaderCell scope="row">
                  Test
                </Table.HeaderCell>
                <Table.HeaderCell scope="row">
                  Test
                </Table.HeaderCell>
              </Table.Row>
          <Table.Row>
            <Table.HeaderCell scope="row">
              Test
            </Table.HeaderCell>
            <Table.HeaderCell scope="row">
              Test
            </Table.HeaderCell>
            <Table.HeaderCell scope="row">
              Test
            </Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell scope="row">
              Test
            </Table.HeaderCell>
            <Table.HeaderCell scope="row">
              Test
            </Table.HeaderCell>
            <Table.HeaderCell scope="row">
              Test
            </Table.HeaderCell>
          </Table.Row>
        </Table.Body>
      </Table>
      {false && (<Pagination
        page={page}
        onPageChange={setPage}
        count={Math.ceil(3 / rowsPerPage)} //Erstatt 3 med tilbeør /reservedeler datalengde
        size="small"
      />
      )}
    </>
  )
}

export default AccessoriesSparePartsBody
