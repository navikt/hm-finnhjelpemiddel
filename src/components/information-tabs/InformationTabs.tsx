import { FilesIcon, InformationSquareIcon, WrenchIcon } from '@navikt/aksel-icons'
import { Heading, Tabs } from '@navikt/ds-react'
import React from 'react'
import { sortAlphabetically } from 'src/utils/sort-util'
import { Supplier } from 'src/utils/supplier-util'
import { Product, Document, TechData } from '../../utils/product-util'
import DefinitionList from '../definition-list/DefinitionList'

export const InformationTabs = ({ product, supplier }: { product: Product; supplier: Supplier }) => {
  return (
    <Tabs defaultValue="productDescription" selectionFollowsFocus>
      <Tabs.List>
        <Tabs.Tab
          value="productDescription"
          label="Produktbeskrivelse fra leverandør"
          icon={<InformationSquareIcon title="Skiftenøkkel" />}
        />
        <Tabs.Tab value="techData" label="Teknisk data" icon={<WrenchIcon title="Skiftenøkkel" />} />
        <Tabs.Tab
          value="documents"
          label={'Tilhørende dokumenter (' + product.documents.length + ')'}
          icon={<FilesIcon title="Dokumenter" />}
        />
      </Tabs.List>
      <Tabs.Panel value="productDescription" className="h-24 w-full p-4">
        <div style={{ padding: '16px' }}>
          {product.attributes.shortdescription && <p>{product.attributes.shortdescription}</p>}
          {product.attributes.text && <p>{product.attributes.text}</p>}{' '}
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="techData" className="h-24 w-full p-4">
        <div style={{ padding: '16px' }}>
          {product.techData && <TechnicalSpesifications techData={product.techData} />}
          {!product.techData && <p>Ingen teknsik data på dette produktet.</p>}
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="documents" className="h-24 w-full p-4">
        {product.documents.length > 0 && <Documents documents={product.documents} />}
        {product.documents.length == 0 && <p>Ingen teknsik data på dette produktet.</p>}
      </Tabs.Panel>
    </Tabs>
  )
}

const TechnicalSpesifications = ({ techData }: { techData: TechData }) => {
  const technicalSpesifications = Object.entries(techData)
    .sort(([keyA, valueA], [keyB, valueB]) => sortAlphabetically(keyA, keyB))
    .map(([key, value], index) => (
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
