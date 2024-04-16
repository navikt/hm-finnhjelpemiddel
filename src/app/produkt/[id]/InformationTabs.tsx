'use client'

import NextLink from 'next/link'

import { FilesIcon, InformationSquareIcon } from '@navikt/aksel-icons'
import { Accordion, BodyLong, BodyShort, HStack, Heading, HelpText, Link, Tabs, VStack } from '@navikt/ds-react'

import { Document, Product, Video } from '@/utils/product-util'
import { titleCapitalized } from '@/utils/string-util'

import DefinitionList from '@/components/definition-list/DefinitionList'
import { VideoplayerIcon } from '@navikt/aksel-icons'

import File from '@/components/File'
import ReactPlayer from 'react-player'

export const InformationTabs = ({ product }: { product: Product }) => (
  <Tabs defaultValue="productDescription" selectionFollowsFocus>
    <Tabs.List>
      <Tabs.Tab
        value="productDescription"
        label="Produktinformasjon"
        icon={<InformationSquareIcon title="Skiftenøkkel" />}
      />
      <Tabs.Tab
        value="documents"
        label={`Tilhørende dokumenter (${product.documents.length})`}
        icon={<FilesIcon title="Dokumenter" />}
      />
      <Tabs.Tab value="videos" label={`Video (${product.videos.length})`} icon={<VideoplayerIcon title="Video" />} />
    </Tabs.List>
    <Tabs.Panel value="productDescription" className="h-24 w-full p-4">
      <div className="product-info__tabs__panel">
        <ProductDescription product={product} />
      </div>
    </Tabs.Panel>
    <Tabs.Panel value="documents" className="h-24 w-full p-4">
      <div className="product-info__tabs__panel">
        <Documents documents={product.documents} />
      </div>
    </Tabs.Panel>
    <Tabs.Panel value="videos" className="h-24 w-full p-4">
      <div className="product-info__tabs__panel">
        <Videos videos={product.videos} />
      </div>
    </Tabs.Panel>
  </Tabs>
)

export const InformationAccordion = ({ product }: { product: Product }) => (
  <Accordion>
    <Accordion.Item>
      <Accordion.Header>Produktinformasjon</Accordion.Header>
      <Accordion.Content>
        <div className="product-info__accordion">
          <ProductDescription product={product} />
        </div>
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item>
      <Accordion.Header>Tilhørende dokumenter ({product.documents.length})</Accordion.Header>
      <Accordion.Content>
        <div className="product-info__accordion">
          <Documents documents={product.documents} />
        </div>
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item>
      <Accordion.Header>Video ({product.videos.length})</Accordion.Header>
      <Accordion.Content>
        <div className="product-info__accordion">
          <Videos videos={product.videos} />
        </div>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>
)

const ProductDescription = ({ product }: { product: Product }) => {
  const bo = new Set(product.variants.map((p) => p.bestillingsordning))
  const ds = new Set(product.variants.map((p) => p.digitalSoknad))

  const bestillingsordning =
    bo.size > 1 ? (
      <BodyShort>
        Noen varianter.{' '}
        <Link as={NextLink} href="#produktvarianter">
          Se tabell nedenfor.
        </Link>
      </BodyShort>
    ) : bo.has(true) ? (
      <BodyShort>Ja</BodyShort>
    ) : (
      <BodyShort>Nei</BodyShort>
    )

  const digitalSoknad =
    ds.size > 1 ? (
      <BodyShort>
        Noen varianter.{' '}
        <Link as={NextLink} href="#produktvarianter">
          Se tabell nedenfor.
        </Link>
      </BodyShort>
    ) : ds.has(true) ? (
      <BodyShort>Ja</BodyShort>
    ) : (
      <BodyShort>Nei</BodyShort>
    )

  return (
    <div className="product-info__product-description">
      <Heading level="2" size="medium" spacing>
        Beskrivelse
      </Heading>
      <BodyLong spacing>
        {product.attributes.text
          ? product.attributes.text
          : 'Ingen beskrivelse fra leverandør. Ta kontakt med leverandør for mer informasjon.'}
      </BodyLong>
      <DefinitionList>
        <DefinitionList.Term>
          <Bestillingsordning_HelpText />
        </DefinitionList.Term>
        <DefinitionList.Definition>{bestillingsordning}</DefinitionList.Definition>
        <DefinitionList.Term>
          <DigitalSoknad_HelpText />
        </DefinitionList.Term>
        <DefinitionList.Definition>{digitalSoknad}</DefinitionList.Definition>
        <DefinitionList.Term>ISO-kategori (kode)</DefinitionList.Term>
        <DefinitionList.Definition>
          {product.isoCategoryTitle + ' (' + product.isoCategory + ')'}
        </DefinitionList.Definition>
      </DefinitionList>
    </div>
  )
}
const Documents = ({ documents }: { documents: Document[] }) => {
  if (!documents.length) {
    return <BodyShort>Ingen dokumenter på dette produktet.</BodyShort>
  }

  return (
    <ul className="document-list">
      {documents.map((doc, index) => (
        <li key={index}>
          <File title={titleCapitalized(doc.title)} path={doc.uri} />
        </li>
      ))}
    </ul>
  )
}

const Bestillingsordning_HelpText = () => {
  return (
    <div className="product-info__help-text">
      Bestillingsordning
      <HelpText placement="right" strategy="absolute">
        Bestillingsordningen er en forenkling av saksbehandling. Gjennom denne ordningen kan man bestille enkle
        hjelpemidler som hjelpemiddelsentralene har på lager.
      </HelpText>
    </div>
  )
}

const DigitalSoknad_HelpText = () => {
  return (
    <div className="product-info__help-text">
      Digital behovsmelding
      <HelpText placement="right" strategy="absolute">
        Digital behovsmelding betyr at man kan melde behov for hjelpemidler digitalt, og gjelder for et utvalg av
        hjelpemidler innen utvalgte kategorier. Ordningen kan benyttes av kommunalt ansatte.
      </HelpText>
    </div>
  )
}

export default InformationTabs

const Videos = ({ videos }: { videos: Video[] }) => {
  if (!videos.length) {
    return <BodyShort>Ingen videolenker til dette produktet.</BodyShort>
  }
  return (
    <HStack as="ul" gap="8" className="video-list">
      {videos.map((video, index) => (
        <VStack as="li" key={index} gap="4">
          <Link target="_blank" title={video.uri} href={video.uri}>
            {video.text || video.uri}
          </Link>
          <ReactPlayer url={video.uri} controls={true} width="100%" height="100%" />
        </VStack>
      ))}
    </HStack>
  )
}
