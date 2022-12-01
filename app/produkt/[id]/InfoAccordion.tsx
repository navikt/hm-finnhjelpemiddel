'use client'
import { Accordion } from '@navikt/ds-react'
import React from 'react'
import { TekniskData } from '../../../utils/produkt-util'
import Definisjonsliste from './Definisjonsliste'

const InfoAccordion = ({ tekniskData }: { tekniskData: TekniskData[] }) => {
  const spesifikasjoner = tekniskData.map(({ key, value }, i) => (
    <React.Fragment key={key + String(i)}>
      <Definisjonsliste.Term term={key} />
      <Definisjonsliste.Definition definition={value} />
    </React.Fragment>
  ))
  return (
    <Accordion>
      <Accordion.Item>
        <Accordion.Header>Spesifikasjoner</Accordion.Header>
        <Accordion.Content>
          <div className="teknisk-data">
            <Definisjonsliste>{spesifikasjoner}</Definisjonsliste>
          </div>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Header>Dokumentasjon/support</Accordion.Header>
        <Accordion.Content>Dokumenter og brosyrer kan ligge her</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  )
}

export default InfoAccordion
