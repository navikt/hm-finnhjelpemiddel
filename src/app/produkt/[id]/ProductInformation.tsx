import DefinitionList from '@/components/definition-list/DefinitionList'
import { containsHTML, Product, validateHTML } from '@/utils/product-util'
import { BodyLong, BodyShort, HelpText, HStack, Link } from '@navikt/ds-react'
import NextLink from 'next/link'
import { ArrowDownRightIcon, GlobeIcon } from "@navikt/aksel-icons";

const ProductInformation = ({ product }: { product: Product }) => {
  const bo = new Set(product.variants.map((p) => p.bestillingsordning))
  const ds = new Set(product.variants.map((p) => p.digitalSoknad))

  const htmlDescription = containsHTML(product.attributes.text) && validateHTML(product.attributes.text)

  const bestillingsordning =
    bo.size > 1 ? (
      <BodyShort>
        Noen varianter.{' '}
        <Link as={NextLink} href="#egenskaper">
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
        <Link as={NextLink} href="#egenskaper">
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
      {!product.attributes.text && (
        <BodyLong spacing className="product-page__description">
          Ingen beskrivelse fra leverandør. Ta kontakt med leverandør for mer informasjon.
        </BodyLong>
      )}
      {product.attributes.text && htmlDescription && (
        <div dangerouslySetInnerHTML={{ __html: product.attributes.text }} />
      )}
      {product.attributes.text && !htmlDescription && (
        <BodyLong spacing className="product-page__description">
          {product.attributes.text}
        </BodyLong>
      )}

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
          <HStack gap="1">
            <BodyShort><i>Nivå 3: </i></BodyShort>
            <BodyShort size="medium">{product.isoCategoryTitleInternational + ' (' + product.isoCategory.slice(0,6) + ')'}</BodyShort>
          </HStack>
        </DefinitionList.Definition>
        <DefinitionList.Definition className="product-page__iso-international-text">
          <HStack gap="1">
            <ArrowDownRightIcon title="a11y-title" fontSize="1.5rem" />
            <BodyShort><i>Nivå 4: </i> </BodyShort>
            <BodyShort size="medium">   {product.isoCategoryTitle + ' (' + product.isoCategory + ')'}</BodyShort>
          </HStack>

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
