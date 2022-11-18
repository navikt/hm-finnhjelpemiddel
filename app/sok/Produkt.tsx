import { Accordion, BodyShort, Heading, Link, Table } from '@navikt/ds-react'
import { Produkt } from '../../utils/productType'

type ProduktProps = {
  produkt: Produkt
  paaRammeavtale: boolean
}

const Produkt = ({ produkt }: ProduktProps) => {
  return (
    <li>
      <article key="produkt-kompakt">
        <Heading level="3" size="small">
          {produkt.tittel}
        </Heading>
        <BodyShort>{produkt.modell?.beskrivelse}</BodyShort>
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.DataCell>Modell</Table.DataCell>
              <Table.DataCell>{produkt.modell?.navn}</Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>Tilleggsinfo</Table.DataCell>
              <Table.DataCell>{produkt.modell?.beskrivelse}</Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>ISO-kode</Table.DataCell>
              <Table.DataCell>{produkt.isoKode}</Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>HMS-nr.</Table.DataCell>
              <Table.DataCell>{produkt.hmsNr}</Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>Tilbehør</Table.DataCell>
              <Table.DataCell>{produkt.tilbehor ? 'Ja' : 'Nei'}</Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>Del</Table.DataCell>
              <Table.DataCell>{produkt.del ? 'Ja' : 'Nei'}</Table.DataCell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Accordion>
          <Accordion.Item>
            <Accordion.Header>Tekniske data</Accordion.Header>
            <Accordion.Content>
              <Table>
                <Table.Body>
                  {produkt.tekniskData?.map((data) => (
                    <Table.Row key={data.key}>
                      <Table.DataCell>{data.key}</Table.DataCell>
                      <Table.DataCell>
                        {data.value} {data.unit}
                      </Table.DataCell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
        <Link href={`/produkt/${produkt.id}`}>Les mer</Link>
      </article>
    </li>
  )
}

export default Produkt
