import { containsHTML, Product, validateHTML } from '@/utils/product-util'
import { BodyLong, BodyShort, Heading, HelpText, Hide, HStack, Link, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import { ArrowDownRightIcon } from '@navikt/aksel-icons'

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
    <VStack gap={'11'}>
      <Description description={description} />
      <VStack gap={'6'}>
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

const Description = ({ description }: { description: string | undefined }) => {
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
  sett: Set<boolean | Boolean>
}
const BestillingsordningBehovsmelding = ({ heading, helpText, sett }: BestillingsordningBehovsmeldingProps) => {
  const bestillingsordning =
    sett.size > 1 ? (
      <div>
        <BodyShort>Noen varianter.</BodyShort>
        <Link as={NextLink} href="#egenskaper">
          Se tabell nedenfor.
        </Link>
      </div>
    ) : sett.has(true) ? (
      <BodyShort>Ja</BodyShort>
    ) : (
      <BodyShort>Nei</BodyShort>
    )
  return (
    <div>
      <HStack gap={'2'}>
        <Heading size={'xsmall'} level={'4'}>
          {heading}
        </Heading>
        <HelpText placement="right">{helpText}</HelpText>
      </HStack>
      {bestillingsordning}
    </div>
  )
}

type ISOCategoryProps = {
  isoCategory: string
  isoCategoryTitle: string
  isoCategoryTitleInternational: string
}
const ISOCategory = ({ isoCategory, isoCategoryTitle, isoCategoryTitleInternational }: ISOCategoryProps) => {
  return (
    <div>
      <Heading size={'xsmall'} level={'4'}>
        ISO-kategori (kode)
      </Heading>
      <HStack gap={'1'}>
        <BodyShort>Nivå 3:</BodyShort>
        <BodyShort size="medium">{isoCategoryTitleInternational + ' (' + isoCategory.slice(0, 6) + ')'}</BodyShort>
      </HStack>
      <HStack gap="1">
        <BodyShort>Nivå 4:</BodyShort>
        <BodyShort size="medium"> {isoCategoryTitle + ' (' + isoCategory + ')'}</BodyShort>
      </HStack>
    </div>
  )
}
