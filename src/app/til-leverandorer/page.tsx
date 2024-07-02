'use client'
import AnimateLayout from '@/components/layout/AnimateLayout'
import { BodyLong, Heading, Link, List } from '@navikt/ds-react'

function ToSuppliers() {
  return (
    <div className="about-us-page">
      <AnimateLayout>
        <div className="about-us-page__container">
          <article>
            <Heading level="1" size="medium" className="spacing-top--small spacing-bottom--medium">
              For leverandører
            </Heading>
            <Heading level="2" size="small" spacing id="hva-er-et-hjelpemiddel">
              Hva er et hjelpemiddel?
            </Heading>
            <BodyLong spacing>
              FinnHjelpemiddel forholder seg i hovedsak til folketrygdens definisjon av et hjelpemiddel. Det vil si at
              hjelpemidlene som presenteres er spesiallaget for personer med funksjonsnedsettelse. For mer informasjon
              om hva som defineres som et hjelpemiddel, se{' '}
              <Link href="https://lovdata.no/nav/rundskriv/r10-07acd/KAPITTEL_1-1-2.#KAPITTEL_1-1-2">
                rundskriv til folketrygdloven § 10-7
              </Link>
              .
            </BodyLong>
            <BodyLong>Produkter som klart faller utenfor hjelpemiddelbegrepet i denne sammenhengen er:</BodyLong>
            <List as="ul">
              <List.Item>Vanlige møbler</List.Item>
              <List.Item>Brune- og hvitevarer</List.Item>
              <List.Item>Vanlig kjøkkenutstyr</List.Item>
              <List.Item>Bøker og læremidler</List.Item>
              <List.Item>
                Vanlig treningsutstyr (matter, ribbevegger, balanseutstyr, treningsstrikk, svømme- og flyteutstyr,
                sykkelvogner, terapimaster, treningsbenker, tredemøller m.m.)
              </List.Item>
              <List.Item>Forbruksvarer</List.Item>
              <List.Item>Vanlige spill (også PC-spill)</List.Item>
              <List.Item>
                Vanlige leker (rangler, uro, speilkaruseller, byggeklosser, taktile leker, leker som lager lyd, baller,
                akebrett, krypetuneller m.m.)
              </List.Item>
              <List.Item>
                Klær (med unntak av inkontinensbadetøy, kjørehansker, kjøreposer, regncape for personer i rullestol og
                noen bestemte varmehjelpemidler.)
              </List.Item>
              <List.Item>Behandlingshjelpemidler</List.Item>
            </List>
            <BodyLong spacing>
              Definisjonen av et hjelpemiddel vil endre seg over tid og kriteriene for registrering i FinnHjelpemiddel
              vil derfor bli vurdert jevnlig. Hjelpemidler som er under utvikling og som ikke er lansert vil ikke bli
              publisert.
            </BodyLong>

            <Heading level="2" size="small" spacing>
              Produktkategorier
            </Heading>
            <BodyLong spacing>
              Alle hjelpemidler som publiseres på FinnHjelpemiddel, er kategorisert etter gjeldende versjon av Norsk
              Standard «NS-EN ISO 9999 - Hjelpemidler for personer med nedsatt funksjonsevne». Standarden er basert på
              oversettelse fra engelsk utført av{' '}
              <Link href="https://online.standard.no/ns-en-iso-9999-2022"> Standard Norge.</Link>
            </BodyLong>
            <Heading level="2" size="small" spacing>
              Hvem kan registrere hjelpemidler?
            </Heading>
            <BodyLong>
              {`Leverandørene i FinnHjelpemiddel må være norske, eller ha norske underleverandører. Hjelpemidlene som skal
              registreres må fylle kriteriene for et hjelpemiddel (se over).`}
            </BodyLong>
            <BodyLong spacing>
              Send en henvendelse til <Link href="mailto:finnhjelpemiddel@nav.no">finnhjelpemiddel@nav.no</Link> for å
              få informasjon om innlogging.
            </BodyLong>
            <Heading level="2" size="small" spacing>
              Kontakt oss
            </Heading>
            <BodyLong spacing>
              Ved spørsmål eller tilbakemeldinger ta kontakt på{' '}
              <Link href="mailto:finnhjelpemiddel@nav.no">finnhjelpemiddel@nav.no</Link>.
            </BodyLong>
          </article>
        </div>
      </AnimateLayout>
    </div>
  )
}

export default ToSuppliers
