'use client'

import DefinitionList from '@/components/definition-list/DefinitionList'
import { Product } from '@/utils/product-util'
import { BodyShort, HelpText, Link } from '@navikt/ds-react'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

type KeyInformationProps = {
  product: Product
  supplierName: string | null
}

const KeyInformation = ({ product, supplierName }: KeyInformationProps) => {
  const router = useRouter()

  const scrollToAgreementInfo = () => {
    router.push(`/produkt/${product.id}#agreement-info`)
  }

  const oa = new Set(product.variants.map((p) => p.hasAgreement))
  const bo = new Set(product.variants.map((p) => p.bestillingsordning))
  const ds = new Set(product.variants.map((p) => p.digitalSoknad))

  const onAgreement =
    oa.size > 1 ? (
      <BodyShort>
        Noen varianter.{' '}
        <Link as={NextLink} href="#produktvarianter">
          Se tabell nedenfor.
        </Link>
      </BodyShort>
    ) : oa.has(true) ? (
      <BodyShort>Ja, les mer her</BodyShort>
    ) : (
      <BodyShort>Nei</BodyShort>
    )

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
    <DefinitionList>
      <DefinitionList.Term>Hjelpemiddelgruppe</DefinitionList.Term>
      <DefinitionList.Definition>{product.isoCategoryTitle}</DefinitionList.Definition>
      <DefinitionList.Term>HMS-nummer</DefinitionList.Term>
      <DefinitionList.Definition>{supplierName}</DefinitionList.Definition>
      <DefinitionList.Term>Leverandør</DefinitionList.Term>
      <DefinitionList.Definition>{supplierName}</DefinitionList.Definition>
      {/* <DefinitionList.Term>Lev-artnr</DefinitionList.Term>
      <DefinitionList.Definition>{product.variants[0].supplierRef}</DefinitionList.Definition> */}
      <DefinitionList.Term>
        <OnAgreement_HelpText />
      </DefinitionList.Term>
      <DefinitionList.Definition>{onAgreement}</DefinitionList.Definition>
      {/* <DefinitionList.Term>
          <Bestillingsordning_HelpText />
        </DefinitionList.Term>
        <DefinitionList.Definition>{bestillingsordning}</DefinitionList.Definition>
        <DefinitionList.Term>
          <DigitalSoknad_HelpText />
        </DefinitionList.Term>
        <DefinitionList.Definition>{digitalSoknad}</DefinitionList.Definition> 
        <DefinitionList.Term>ISO-kategori (kode)</DefinitionList.Term>
        <DefinitionList.Definition>
          {product.isoCategoryTitle + '(' + product.isoCategory + ')'}
        </DefinitionList.Definition>
        */}
    </DefinitionList>
  )
}

export default KeyInformation

const OnAgreement_HelpText = () => {
  return (
    <div className="product-info__help-text">
      På avtale med NAV
      <HelpText placement="right" strategy="absolute">
        Bestillingsordningen er en forenkling av saksbehandling. Gjennom denne ordningen kan man bestille enkle
        hjelpemidler som hjelpemiddelsentralene har på lager.
      </HelpText>
    </div>
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
