import { FilesIcon, WrenchIcon } from '@navikt/aksel-icons'
import { Tabs } from '@navikt/ds-react'
import React from 'react'
import { Product, Document, TechData } from '../../utils/product-util'
import DefinitionList from '../definition-list/DefinitionList'

export const InformationTabs = ({ product }: { product: Product }) => {
  return (
    <Tabs defaultValue="techData" selectionFollowsFocus>
      <Tabs.List>
        <Tabs.Tab value="techData" label="Teknisk data" icon={<WrenchIcon title="Skiftenøkkel" />} />
        <Tabs.Tab
          value="documents"
          label={'Tilhørende dokumenter (' + product.documents.length + ')'}
          icon={<FilesIcon title="Dokumenter" />}
        />
      </Tabs.List>
      <Tabs.Panel value="techData" className="h-24 w-full bg-gray-50 p-4">
        {product.techData && <TechnicalSpesifications techData={product.techData} />}
        {!product.techData && <p>Ingen teknsik data på dette produktet.</p>}
      </Tabs.Panel>
      <Tabs.Panel value="documents" className="h-24 w-full bg-gray-50 p-4">
        {product.documents.length > 0 && <Documents documents={product.documents} />}
        {product.documents.length == 0 && <p>Ingen teknsik data på dette produktet.</p>}
      </Tabs.Panel>
    </Tabs>
  )
}

const TechnicalSpesifications = ({ techData }: { techData: TechData }) => {
  const technicalSpesifications = Object.entries(techData).map(([key, value], index) => (
    <React.Fragment key={`${key}${index}`}>
      <DefinitionList.Term>{key}</DefinitionList.Term>
      <DefinitionList.Definition>{value.value + (value.unit ? ' ' + value.unit : '')}</DefinitionList.Definition>
    </React.Fragment>
  ))

  return <DefinitionList>{technicalSpesifications}</DefinitionList>
}

const Documents = ({ documents }: { documents: Document[] }) => {
  const documentLoader = (uri: string) => {
    return `https://www.hjelpemiddeldatabasen.no/blobs/produktblade/${uri}`
  }

  const titleCapitalized = (documentTitle: string) => {
    const title = documentTitle
    if (title.length == 1) {
      return title.charAt(0).toUpperCase()
    }
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  return (
    <ul>
      {documents.map((doc, index) => (
        <li>
          {doc.title.length > 0 && (
            <a href={documentLoader(doc.uri)} target="_blank" rel="noreferrer">
              {titleCapitalized(doc.title)} (PDF)
            </a>
          )}
          {doc.title.length == 0 && (
            <a href={documentLoader(doc.uri)} target="_blank" rel="noreferrer">
              Dokument uten navn (PDF)
            </a>
          )}
        </li>
      ))}
    </ul>
  )
}

export default InformationTabs
