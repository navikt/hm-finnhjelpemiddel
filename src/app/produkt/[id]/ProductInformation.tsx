import DefinitionList from '@/components/definition-list/DefinitionList'
import { Product } from '@/utils/product-util'
import { BodyLong, BodyShort, Heading, HelpText, Link } from '@navikt/ds-react'
import NextLink from 'next/link'

const ProductInformation = ({ product }: { product: Product }) => {
  const bo = new Set(product.variants.map((p) => p.bestillingsordning))
  const ds = new Set(product.variants.map((p) => p.digitalSoknad))

  const bestillingsordning =
    bo.size > 1 ? (
      <BodyShort>
        Noen varianter.{' '}
        <Link as={NextLink} href="#varianter">
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
        <Link as={NextLink} href="#varianter">
          Se tabell nedenfor.
        </Link>
      </BodyShort>
    ) : ds.has(true) ? (
      <BodyShort>Ja</BodyShort>
    ) : (
      <BodyShort>Nei</BodyShort>
    )

  return (
    <>
      <Heading level="2" size="large" spacing>
        Beskrivelse
      </Heading>
      <BodyLong spacing className="product-page__description">
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
    </>
  )
}

const Bestillingsordning_HelpText = () => {
  return (
    <div className="product-page__help-text">
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
    <div className="product-page__help-text">
      Digital behovsmelding
      <HelpText placement="right" strategy="absolute">
        Digital behovsmelding betyr at man kan melde behov for hjelpemidler digitalt, og gjelder for et utvalg av
        hjelpemidler innen utvalgte kategorier. Ordningen kan benyttes av kommunalt ansatte.
      </HelpText>
    </div>
  )
}

export default ProductInformation
