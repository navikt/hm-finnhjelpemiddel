'use client'

import DefinitionList from '@/components/definition-list/DefinitionList'
import { Product } from '@/utils/product-util'
import { Supplier } from '@/utils/supplier-util'
import { ExternalLinkIcon, ThumbUpIcon } from '@navikt/aksel-icons'
import { BodyShort, CopyButton, HelpText, Link } from '@navikt/ds-react'
import NextLink from 'next/link'

type KeyInformationProps = {
  product: Product
  supplier: Supplier | null
}

const KeyInformation = ({ product, supplier }: KeyInformationProps) => {
  const oa = new Set(product.variants.map((p) => p.hasAgreement))
  const hms = new Set(product.variants.map((p) => p.hmsArtNr).filter((hms) => hms))

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
        iconPosition="right"
      />
    ) : hms.size > 1 ? (
      <BodyShort>
        <Link as={NextLink} href="#egenskaper">
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
      {product.agreements.length === 0 && (
        <>
          <DefinitionList.Term>
            <OnAgreement_HelpText />
          </DefinitionList.Term>
          <DefinitionList.Definition>Nei</DefinitionList.Definition>
        </>
      )}

      {product.agreements.length > 0 && (
        <>
          <DefinitionList.Term>Delkontrakt</DefinitionList.Term>
          <DefinitionList.Definition>
            {product.agreements.length > 1 ? (
              <BodyShort>
                Hjelpemiddelet er på flere delkontrakter.{' '}
                <Link as={NextLink} href="#agreement-info">
                  Se avtale informasjon.
                </Link>
              </BodyShort>
            ) : (
              <BodyShort>
                <Link as={NextLink} href="#agreement-info">
                  {product.agreements[0].postTitle}
                </Link>
              </BodyShort>
            )}
          </DefinitionList.Definition>
        </>
      )}

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
          {product.attributes.url && (
            <DefinitionList.Definition>
              <Link href={product.attributes.url} target={'_blank'}>
                Leverandørens produktside <ExternalLinkIcon />
              </Link>
            </DefinitionList.Definition>
          )}
        </>
      )}
    </DefinitionList>
  )
}

export default KeyInformation

const OnAgreement_HelpText = () => {
  return (
    <div className="product-page__help-text">
      På avtale med NAV
      <HelpText placement="right" strategy="absolute">
        Ved søknad om et hjelpemiddel fra NAV skal du alltid først vurdere om et av hjelpemidlene i en avtale kan
        benyttes for å dekke ditt behov.
      </HelpText>
    </div>
  )
}
