'use client'

import DefinitionList from '@/components/definition-list/DefinitionList'
import { Product } from '@/utils/product-util'
import { Supplier } from '@/utils/supplier-util'
import { ArrowDownIcon, ThumbUpIcon } from '@navikt/aksel-icons'
import { BodyShort, CopyButton, HelpText, Link } from '@navikt/ds-react'
import NextLink from 'next/link'

type KeyInformationProps = {
  product: Product
  supplier: Supplier | null
}

const KeyInformation = ({ product, supplier }: KeyInformationProps) => {
  const oa = new Set(product.variants.map((p) => p.hasAgreement))

  const hms = new Set(product.variants.map((p) => p.hmsArtNr).filter((hms) => hms))

  const onAgreement =
    oa.size > 1 ? (
      <BodyShort>
        Noen varianter.{' '}
        <Link as={NextLink} href="#produktvarianter">
          Se tabell nedenfor.
        </Link>
      </BodyShort>
    ) : oa.has(true) ? (
      <BodyShort>
        <Link as={NextLink} href="#agreement-info">
          Ja, les mer her <ArrowDownIcon color="" aria-hidden />
        </Link>
      </BodyShort>
    ) : (
      <BodyShort>Nei</BodyShort>
    )

  const hmsNummer =
    hms.size === 1 ? (
      <CopyButton
        size="small"
        className="hms-copy-button"
        copyText={[...hms.values()][0] || ''}
        text={[...hms.values()][0] || ''}
        activeText="HMS-nummer er kopiert"
        variant="action"
        activeIcon={<ThumbUpIcon aria-hidden />}
      />
    ) : hms.size > 1 ? (
      <BodyShort>
        <Link as={NextLink} href="#produktvarianter">
          Se tabell med varianter
        </Link>
      </BodyShort>
    ) : (
      <BodyShort>-</BodyShort>
    )
  return (
    <DefinitionList>
      <DefinitionList.Term>Produktkategori</DefinitionList.Term>
      <DefinitionList.Definition>{product.isoCategoryTitle}</DefinitionList.Definition>
      <DefinitionList.Term>HMS-nummer</DefinitionList.Term>
      <DefinitionList.Definition>{hmsNummer}</DefinitionList.Definition>
      {supplier && (
        <>
          <DefinitionList.Term>Leverandør</DefinitionList.Term>
          <DefinitionList.Definition>
            <Link as={NextLink} href={`/leverandorer#${supplier.id}`}>
              {supplier.name}
            </Link>
          </DefinitionList.Definition>
        </>
      )}
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
