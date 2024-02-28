'use client'
import { BodyLong, Heading, HStack, Link, VStack } from '@navikt/ds-react'

function ShowNews() {
  return (
    <>
      <Heading level="2" size="medium" align="center" className="spacing-bottom--large">
        Nyheter
      </Heading>
      <div className="home-page__news-area">
        <VStack gap="3">
          <HStack gap="1" className="home-page__news-box">
            <Heading level="3" size="small">
              NY: Manuelle rullestoler med drivaggregat
            </Heading>
            <BodyLong spacing>
              Datert 01-03-2024 av <Link href="mailto:martin.roen.myhrengen@nav.no">Martin Røen Myhrengen </Link>
              <br />
              Avtalen trer i kraft 01.03.2023
            </BodyLong>
            <BodyLong spacing>
              Avtalen er gjeldende fra 01.03.2024. Du kan lese om rammeavtalen og se produktpresentasjoner på
              Hjelpemiddeldatabasen og FinnHjelpemiddel. På FinnHjelpemiddel vil du få bedre produktvisninger (blant
              annet bedre bilder), og du vil lettere kunne sammenlikne produkter.
              <br />
              <Link href="https://finnhjelpemiddel.nav.no">Se rammeavtalen på FinnHjelpemiddel </Link>
              <br />
              <Link href="https://www.hjelpemiddeldatabasen.no/news.asp?newsid=8756&x_newstype=7">
                Se rammeavtalen på Hjelpemiddeldatabasen
              </Link>
            </BodyLong>
          </HStack>
          <HStack gap="1" className="home-page__news-box">
            <Heading level="3" size="small">
              KOMMER: Manuelle rullestoler med drivaggregat
            </Heading>
            <BodyLong spacing>
              Datert 17-01-2024 av <Link href="mailto:elin.berg@nav.no">Elin Berg</Link>
              <br />
              Avtalen trer i kraft 01.03.2023
            </BodyLong>
            <BodyLong spacing>
              Avtalen gjelder 01.03.24 til 31.11.24. NAV inngikk en rammeavtale for Manuelle rullestolermed drivaggregat
              fra 01.03.2023, hvor det ble laget en egen produktoversikt for rammeavtalen.
            </BodyLong>
          </HStack>
          <HStack gap="1" className="home-page__news-box">
            <Heading level="3" size="small">
              KOMMER: Sykler med og uten hjelpemotor, og støttehjul til tohjulssykler
            </Heading>
            <BodyLong spacing>
              Datert 17-01-2024 av <Link href="mailto:elin.berg@nav.no">Elin Berg</Link>
              <br />
              Avtalen trer i kraft 01.03.2023
            </BodyLong>
            <BodyLong spacing>
              Avtalen gjelder 01.03.24 til 31.11.24. NAV inngikk en rammeavtale for Sykler med og uten hjelpemotor, og
              støttehjul til tohjulssykler fra 01.03.2023, hvor det ble laget en egen produktoversikt for rammeavtalen.
            </BodyLong>
          </HStack>
        </VStack>
      </div>
    </>
  )
}

export default ShowNews
