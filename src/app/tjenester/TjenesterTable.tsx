import { CopyButton, Hide, Skeleton, Table } from '@navikt/ds-react'
import styles from './TjenesterTable.module.scss'
import { ThumbUpIcon } from '@navikt/aksel-icons'
import { ServiceJob } from '@/utils/servicejob-util'

export const TjenesterTable = ({ tjenester }: { tjenester: ServiceJob[] }) => {
  return tjenester ? (
    <Table zebraStripes>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">HMS-nummer</Table.HeaderCell>
          <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
          <Hide below={'md'} asChild>
            <Table.HeaderCell scope="col">Leverandørnavn</Table.HeaderCell>
          </Hide>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {tjenester.map((tjeneste) => (
          <Table.Row key={tjeneste.id}>
            <Table.DataCell>
              <CopyButton
                size="small"
                copyText={tjeneste.hmsArtNr ?? ''}
                text={tjeneste.hmsArtNr ?? ''}
                activeText="Kopiert"
                variant="action"
                activeIcon={<ThumbUpIcon aria-hidden />}
                iconPosition="right"
                className={styles.copyButton}
              />
            </Table.DataCell>
            <Table.DataCell>{tjeneste.title}</Table.DataCell>
            <Hide below={'md'} asChild>
              <Table.DataCell>{tjeneste.supplierName}</Table.DataCell>
            </Hide>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ) : (
    <Skeleton />
  )
}
