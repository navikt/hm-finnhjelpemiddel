import { Accordion } from '@navikt/ds-react'
import React from 'react'
import { TechData } from '../../utils/product-util'
import DefinitionList from '../DefinitionList/DefinitionList'

const InfoAccordion = ({ techData }: { techData: TechData }) => {
  const technicalSpesifications = Object.entries(techData).map(([key, value], index) => (
    <React.Fragment key={`${key}${index}`}>
      <DefinitionList.Term>{key}</DefinitionList.Term>
      <DefinitionList.Definition>{value.value + (value.unit ? ' ' + value.unit : '')}</DefinitionList.Definition>
    </React.Fragment>
  ))
  return (
    <Accordion className="info-accordion">
      <Accordion.Item defaultOpen={true}>
        <Accordion.Header>Spesifikasjoner</Accordion.Header>
        <Accordion.Content>
          <DefinitionList>{technicalSpesifications}</DefinitionList>
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
