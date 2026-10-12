import React from 'react'

import { Metadata } from 'next'

import { Accordion, Bleed, BodyShort, VStack } from '@navikt/ds-react'
import { AccordionContent, AccordionHeader, AccordionItem } from '@navikt/ds-react/Accordion'

import { BodyLong, Heading, Link } from '@/components/aksel-client'

export const metadata: Metadata = {
  title: 'Om nettstedet',
  description: 'Informasjon om nettstedet',
}

function AboutUs() {
  return (
    <VStack
      gap={'space-64'}
      paddingBlock={'space-0 space-64'}
      paddingInline={{ xs: 'space-16', md: 'space-0' }}
      marginInline={'auto'}
      marginBlock={'space-0'}
      maxWidth={'700px'}
      align={'center'}
    >
      <Bleed style={{ backgroundColor: '#F5F9FF' }} reflectivePadding marginInline={'full'}>
        <VStack gap={'space-16'} paddingBlock={'space-64'}>
          <Heading level="1" size="medium">
            Om FinnHjelpemiddel
          </Heading>
          <BodyLong>
            FinnHjelpemiddel er et nettsted for alle som ønsker informasjon om hjelpemidler og Navs avtaler med
            leverandører. Nettstedet utvikles og driftes av Nav hjelpemidler og tilrettelegging.
          </BodyLong>
        </VStack>
      </Bleed>

      <VStack gap={'space-64'} maxWidth={'700px'}>
        <VStack>
          <Heading size={'medium'} spacing>
            Generelle spørsmål
          </Heading>
          <Accordion>
            <AccordionItem>
              <AccordionHeader>Hva er et hjelpemiddel?</AccordionHeader>
              <AccordionContent>
                <BodyLong spacing>
                  Nav forvalter hjelpemidler som dekkes gjennom folketrygden. Derfor er det folketrygdens regler som
                  bestemmer hva som regnes som hjelpemidler i denne sammenhengen.{' '}
                </BodyLong>
                <BodyLong>
                  Hjelpemidler etter folketrygdloven er løsninger som er nødvendige og hensiktsmessige for å kompensere
                  for en varig funksjonsnedsettelse. Hjelpemidler som er vanlige i befolkningen eller som kan kjøpes i
                  ordinær handel, regnes som hovedregel ikke som hjelpemidler etter folketrygdloven. Det samme gjelder
                  behandlingshjelpemidler. Hvilke produkter og løsninger som til enhver tid omfattes av folketrygdens
                  hjelpemiddelbegrep, kan endre seg i takt med samfunnsutvikling, teknologiutvikling og endringer i
                  regelverket.
                </BodyLong>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem>
              <AccordionHeader>Hvilke hjelpemidler finnes på FinnHjelpemiddel?</AccordionHeader>
              <AccordionContent>
                <BodyShort>FinnHjelpemiddel inneholder:</BodyShort>
                <ul>
                  <li>hjelpemidler som er på avtale med Nav (markert med «på avtale»)</li>
                  <li>hjelpemidler som ikke er på avtale med Nav (markert med «ikke på avtale»)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem>
              <AccordionHeader>Hjelpemidler på avtale med Nav</AccordionHeader>
              <AccordionContent>
                <BodyLong spacing>
                  For å kunne bruke FinnHjelpemiddel på en god og effektiv måte er det viktig at du kjenner til
                  betydningen av følgende begreper:
                </BodyLong>

                <BodyShort weight={'semibold'}>På avtale:</BodyShort>
                <BodyLong spacing>
                  Nav inngår avtaler med leverandører av hjelpemidler. Hjelpemidler på avtale, skal dekke behov som
                  skyldes funksjonsnedsettelsen. I en søknadsprosess vurderes hjelpemidler på avtale først. Disse
                  hjelpemidlene er merket med «På avtale».
                </BodyLong>

                <BodyShort weight={'semibold'}>Delkontrakt:</BodyShort>
                <BodyLong spacing>
                  Avtalene med leverandører er inndelt i delkontrakter slik at man lettere skal kunne orientere seg.
                  Inndelingen er gjort ut ifra hjelpemidlenes egenskaper som for eksempel «Rullator – innendørs bruk med
                  smal bredde». Hjelpemidler på avtale er markert med tittel eller nummeret på delkontrakten.
                </BodyLong>
                <BodyShort weight={'semibold'}>Rangering:</BodyShort>
                <BodyLong spacing>
                  En delkontrakt kan inneholde hjelpemidler med ulik rangering. Hjelpemidler merket med rangering 1 skal
                  vurderes først. Dersom dette hjelpemiddelet ikke dekker behovet skal rangering 2 vurderes, og så
                  videre. Hvis et hjelpemiddel med for eksempel rangering 3 er nødvendig, må det begrunnes hvorfor ikke
                  behovet dekkes av rangering 1 og 2. Alle hjelpemidler på avtale er markert med hvilken rangering de
                  tilhører.
                </BodyLong>
                <BodyShort weight={'semibold'}>Ikke på avtale:</BodyShort>
                <BodyLong spacing>
                  FinnHjelpemiddel gir en bred oversikt over hjelpemidler som er på markedet, og inneholder derfor også
                  hjelpemidler som ikke er på avtale med Nav. Disse hjelpemidlene vil i enkelte tilfeller være aktuelle
                  dersom hjelpemidler på avtale ikke dekker behovet. Hjelpemidler uten avtale med Nav er merket med
                  «Ikke på avtale».
                </BodyLong>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem>
              <AccordionHeader>Hvem bestemmer hva som presenteres på FinnHjelpemiddel?</AccordionHeader>
              <AccordionContent>
                Nav bestemmer hvilke hjelpemidler som skal presenteres på FinnHjelpemiddel. All informasjonen som for
                eksempel bilder, brosjyrer og spesifikasjoner registreres av leverandører. Innholdsredaksjonen for
                FinnHjelpemiddel gjennomgår informasjonen før den publiseres.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem>
              <AccordionHeader>Hvem kan låne hjelpemidler fra Nav?</AccordionHeader>
              <AccordionContent>
                <BodyLong>De viktigste vilkårene som må være oppfylt er:</BodyLong>
                <ul>
                  <li>• Funksjonsvanskene må være varige. Det vil si en varighet på over to år.</li>
                  <li>Hjelpemiddelet skal kompensere for funksjonstap.</li>
                  <li>
                    Man må ha{' '}
                    <Link
                      href={
                        'https://www.nav.no/no/person/flere-tema/arbeid-og-opphold-i-norge/relatert-informasjon/medlemskap-i-folketrygden'
                      }
                    >
                      medlemskap i folketrygden (nav.no).
                    </Link>
                  </li>
                </ul>
                <BodyLong>
                  Kommunen kan bistå med å finne hjelpemidler som passer og med å søke. Dersom det er behov for et
                  hjelpemidler i en kortere periode, kan man låne dem direkte fra kommunen.
                </BodyLong>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem>
              <AccordionHeader>Trenger du informasjon om et hjelpemiddel?</AccordionHeader>
              <AccordionContent>
                For spørsmål om hjelpemidler fra Nav eller hjelpemidler på dette nettstedet, kontakt din kommune.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem>
              <AccordionHeader>Innspill til innholdet på FinnHjelpemiddel</AccordionHeader>
              <AccordionContent>
                <BodyLong>
                  Tilbakemeldinger og innspill sendes til{' '}
                  <Link href="mailto:finnhjelpemiddel@nav.no">finnhjelpemiddel@nav.no</Link>.
                </BodyLong>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem>
              <AccordionHeader>Er du leverandør og ønsker å registrere hjelpemidler?</AccordionHeader>
              <AccordionContent>
                <BodyShort>
                  Leverandører som ønsker å registrere hjelpemidler på FinnHjelpemiddel må blant annet:
                </BodyShort>
                <ul>
                  <li>være norsk leverandør, eller ha norske underleverandører</li>
                  <li>levere hjelpemidler som er spesiallaget for personer med nedsatt funksjon</li>
                  <li>ha ferdig utviklede produkter med nødvendig dokumentasjon</li>
                  <li>
                    kunne klassifiseres produktene etter NS-EN ISO 9999 – «Hjelpemidler – klassifisering og terminologi»
                  </li>
                </ul>
                <BodyLong className="spacing-bottom--small">
                  Henvendelser om å opprette registreringstilgang sendes til{' '}
                  <Link href="mailto:finnhjelpemiddel@nav.no">finnhjelpemiddel@nav.no</Link>.
                </BodyLong>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </VStack>
        <VStack gap={'space-16'}>
          <Heading size={'small'}>Nyttig informasjon på nav.no:</Heading>
          <Link href={'https://www.nav.no/hjelpemidler'}>
            Generell informasjon om hjelpemidler og tilrettelegging (nav.no).
          </Link>
          <Link href={'https://www.nav.no/om-hjelpemidler'}>Informasjon til deg som er privatperson (nav.no).</Link>{' '}
          <Link href={'https://www.nav.no/samarbeidspartner/hjelpemiddelformidler'}>
            Informasjon til deg som er samarbeidspartner, samt søknad og skjema (nav.no).{' '}
          </Link>
        </VStack>
      </VStack>
    </VStack>
  )
}

export default AboutUs
