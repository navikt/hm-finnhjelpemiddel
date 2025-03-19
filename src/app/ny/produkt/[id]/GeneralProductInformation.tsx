import { containsHTML, Product, validateHTML } from '@/utils/product-util'
import { BodyLong, BodyShort, Heading, HelpText, HStack, Link, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'

type GeneralProductInformationProps = {
  product: Product
}
export const GeneralProductInformation = ({ product }: GeneralProductInformationProps) => {
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
    <VStack gap={'2'}>
      <Description description={description} />
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

      <Heading size={'xsmall'} level={'4'}>
        ISO-kategori (kode)
      </Heading>
    </VStack>
  )
}
type DescriptionProps = {
  description: string | undefined
}
const Description = ({ description }: DescriptionProps) => {
  const htmlDescription = description && containsHTML(description) && validateHTML(description)
  return (
    <>
      <Heading size={'xsmall'} level={'4'}>
        Beskrivelse
      </Heading>
      {!description ? (
        <BodyLong>Ingen beskrivelse fra leverandør. Ta kontakt med leverandør for mer informasjon.</BodyLong>
      ) : htmlDescription ? (
        <div dangerouslySetInnerHTML={{ __html: description }} />
      ) : (
        <BodyLong>{description}</BodyLong>
      )}
    </>
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
      <BodyShort>
        Noen varianter.{' '}
        <Link as={NextLink} href="#egenskaper">
          Se tabell nedenfor.
        </Link>
      </BodyShort>
    ) : sett.has(true) ? (
      <BodyShort>Ja</BodyShort>
    ) : (
      <BodyShort>Nei</BodyShort>
    )
  return (
    <>
      <HStack gap={'2'}>
        <Heading size={'xsmall'} level={'4'}>
          {heading}
        </Heading>
        <HelpText placement="right">{helpText}</HelpText>
      </HStack>
      {bestillingsordning}
    </>
  )
}
