'use client'
import { Accordion } from '@navikt/ds-react'
import React from 'react'
import { TechData } from '../../../utils/product-util'
import DefinitionList from './DefinitionList'

const InfoAccordion = ({ tekniskData }: { tekniskData: TechData[] }) => {
  const spesifikasjoner = tekniskData.map(({ key, value, unit }, i) => (
    <React.Fragment key={`${key}${i}`}>
      <DefinitionList.Term term={key} />
      <DefinitionList.Definition definition={value + unit} />
    </React.Fragment>
  ))
  return (
    <Accordion className="info-accordion">
      <Accordion.Item defaultOpen={true}>
        <Accordion.Header>Spesifikasjoner</Accordion.Header>
        <Accordion.Content>
          <div className="teknisk-data">
            <DefinitionList>{spesifikasjoner}</DefinitionList>
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
