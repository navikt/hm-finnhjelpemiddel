import { containsHTML, Product, validateHTML } from '@/utils/product-util'
import { BodyLong, BodyShort, HelpText, HStack, Link, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'

export const GeneralProductInformation = ({ product }: { product: Product }) => {
  const description = product.attributes.text
  const bestillingsordning = new Set(product.variants.map((p) => p.bestillingsordning))
  const digitalsoknad = new Set(product.variants.map((p) => p.digitalSoknad))
  const helpTextBestilling =
    'Bestillingsordningen er en forenkling av saksbehandling. Gjennom denne ordningen kan man bestille enkle\n' +
    '        hjelpemidler som hjelpemiddelsentralene har på lager.'
  const helpTextSoknad =
    'Digital behovsmelding betyr at man kan melde behov for hjelpemidler digitalt, og gjelder for et utvalg av\n' +
    '        hjelpemidler innen utvalgte kategorier. Ordningen kan benyttes av kommunalt ansatte.'

  return (
    <VStack gap={'space-44'}>
      <Description description={description} />
      <VStack gap={'space-24'}>
        <BestillingsordningBehovsmelding
          heading={'Bestillingsordning'}
          helpText={helpTextBestilling}
          sett={bestillingsordning}
        />
        <BestillingsordningBehovsmelding
          heading={'Digital behovsmelding'}
          helpText={helpTextSoknad}
          sett={digitalsoknad}
        />
        <ISOCategory
          isoCategory={product.isoCategory}
          isoCategoryTitle={product.isoCategoryTitle}
          isoCategoryTitleInternational={product.isoCategoryTitleInternational}
        />
      </VStack>
    </VStack>
  )
}

export const Description = ({ description }: { description: string | undefined }) => {
  const htmlDescription = description && containsHTML(description) && validateHTML(description)
  return !description ? (
    <BodyLong>Ingen beskrivelse fra leverandør. Ta kontakt med leverandør for mer informasjon.</BodyLong>
  ) : htmlDescription ? (
    <div dangerouslySetInnerHTML={{ __html: description }} />
  ) : (
    <BodyLong>{description}</BodyLong>
  )
}

type BestillingsordningBehovsmeldingProps = {
  heading: string
  helpText: string
  sett: Set<boolean | boolean>
}
export const BestillingsordningBehovsmelding = ({ heading, helpText, sett }: BestillingsordningBehovsmeldingProps) => {
  const bestillingsordning =
    sett.size > 1 ? (
      <BodyShort>
        Noen varianter.
        <br />
        <Link as={NextLink} href="#variants-table">
          Se tabell nedenfor.
        </Link>
      </BodyShort>
    ) : sett.has(true) ? (
      <BodyShort>Ja</BodyShort>
    ) : (
      <BodyShort>Nei</BodyShort>
    )
  return (
    <VStack gap={'space-2'}>
      <HStack gap={'space-8'}>
        <BodyShort weight={'semibold'}>{heading}</BodyShort>
        <HelpText placement="right">{helpText}</HelpText>
      </HStack>
      {bestillingsordning}
    </VStack>
  )
}

type ISOCategoryProps = {
  isoCategory: string
  isoCategoryTitle: string
  isoCategoryTitleInternational: string
}
export const ISOCategory = ({ isoCategory, isoCategoryTitle, isoCategoryTitleInternational }: ISOCategoryProps) => {
  return (
    <VStack gap={'space-2'}>
      <BodyShort weight={'semibold'}>ISO-kategori (kode)</BodyShort>
      <HStack gap={'space-4'}>
        <BodyShort>Nivå 3:</BodyShort>
        <BodyShort size="medium">{isoCategoryTitleInternational + ' (' + isoCategory.slice(0, 6) + ')'}</BodyShort>
      </HStack>
      <HStack gap="space-4">
        <BodyShort>Nivå 4:</BodyShort>
        <BodyShort size="medium"> {isoCategoryTitle + ' (' + isoCategory + ')'}</BodyShort>
      </HStack>
    </VStack>
  )
}
