'use client'
import AnimateLayout from '@/components/layout/AnimateLayout'
import { BodyLong, BodyShort, Heading, Link, List } from '@navikt/ds-react'

function ToSuppliers() {
  return (
    <div className="about-us-page">
      <AnimateLayout>
        <div className="about-us-page__container">
          <article>
            <Heading level="1" size="medium" spacing>
              Om FinnHjelpemiddel for leverandører
            </Heading>
            <Heading level="2" size="small">
              Om nettstedet
            </Heading>
            <BodyLong spacing>FinnHjelpemiddel eies og driftes av NAV Hjelpemidler og tilrettelegging.</BodyLong>
            <Heading level="2" size="small">
              Målgrupper
            </Heading>
            <BodyLong spacing>
              Hovedmålgruppene for FinnHjelpemiddel er innbyggere, kommuner og NAV hjelpemiddelsentraler.
            </BodyLong>
            <Heading level="2" size="small">
              Hva er et hjelpemiddel?
            </Heading>
            <BodyLong>
              På FinnHjelpemiddel forholder vi oss i hovedsak til folketrygdens definisjon av et hjelpemiddel. Det vil
              si at hjelpemidlene som presenteres er spesiallaget for personer med funksjonsnedsettelse. For mer
              informasjon om hva som defineres som et hjelpemiddel, se
              <Link href="https://lovdata.no/nav/rundskriv/r10-07acd/KAPITTEL_1-1-2.#KAPITTEL_1-1-2">
                rundskriv til folketrygdloven § 10-7.
              </Link>
            </BodyLong>
            <BodyShort>Produkter som klart faller utenfor hjelpemiddelbegrepet i denne sammenhengen er:</BodyShort>
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
            <BodyShort spacing>
              Definisjonen av et hjelpemiddel vil endre seg over tid og kriteriene for registrering FinnHjelpemiddel vil
              derfor bli vurdert jevnlig.
            </BodyShort>
            <BodyLong spacing>
              Hjelpemidler som er under utvikling og som ikke er lansert kan ikke legges inn i FinnHjelpemiddel.
              Leverandørene i FinnHjelpemiddel må være norske, eller ha norske underleverandører.
            </BodyLong>
            <Heading level="2" size="small">
              Produktkategorier
            </Heading>
            <BodyLong spacing>
              Alle hjelpemidler som publiseres på FinnHjelpemiddel, er kategorisert etter gjeldende versjon av Norsk
              Standard «NS-EN ISO 9999 - Hjelpemidler for personer med nedsatt funksjonsevne». Standarden er basert på
              oversettelse fra engelsk utført av{' '}
              <Link href="https://online.standard.no/ns-en-iso-9999-2022"> Standard Norge.</Link>
            </BodyLong>
            <Heading level="2" size="small">
              Kontakt oss
            </Heading>
            <BodyLong spacing>
              Ved spørsmål knyttet til FinnHjelpemiddel ta kontakt på{' '}
              <Link href="mailto:finnhjelpemiddel@nav.no">finnhjelpemiddel@nav.no</Link>.
            </BodyLong>
          </article>
        </div>
      </AnimateLayout>
    </div>
  )
}

export default ToSuppliers
