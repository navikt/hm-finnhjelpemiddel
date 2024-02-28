import { BodyLong, Heading, Link } from '@/components/aksel-client'
import AnimateLayout from '@/components/layout/AnimateLayout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Om nettstedet',
  description: 'Informasjon om nettstedet',
}

function AboutUs() {
  return (
    <div className="about-us-page">
      <AnimateLayout>
        <div className="about-us-page__container">
          <Heading level="1" size="large" spacing align="center">
            Om nettstedet
          </Heading>
          <article>
            <Heading level="2" size="medium">
              Om nettstedet
            </Heading>
            <BodyLong>FinnHjelpemiddel eies og driftes av NAV Hjelpemidler og tilrettelegging.</BodyLong>
            <Heading level="2" size="medium">
              Målgrupper
            </Heading>
            <BodyLong>
              Hovedmålgruppene for FinnHjelpemiddel er innbyggere, kommuner og NAV hjelpemiddelsentraler.
            </BodyLong>
            <Heading level="2" size="medium">
              Innhold
            </Heading>
            <BodyLong spacing>
              På FinnHjelpemiddel vil du finne informasjon om hjelpemidler på det norske markedet. Hjelpemidlene
              presenteres med tekst, bilder, brosjyrer, bruksanvisninger og tekniske data med mer. Du vil også finne
              informasjon om avtaler med NAV.
            </BodyLong>
            <Heading level="2" size="medium">
              Avtale med NAV
            </Heading>
            <BodyLong spacing>
              NAV må følge regelverket for offentlige anskaffelser og har derfor avtaler med leverandører av
              hjelpemidler innen aktuelle hjelpemiddelområder. Hjelpemidlene som er på avtale med NAV er markert på
              FinnHjelpemiddel, og har egne innganger til hjelpemiddelvisning og informasjon.
            </BodyLong>
            <Heading level="2" size="medium">
              Hva er et hjelpemiddel?
            </Heading>
            <BodyLong spacing>
              Et hjelpemiddel på FinnHjelpemiddel er et produkt som er spesiallaget for personer med
              funksjonsnedsettelse.
            </BodyLong>
            <Heading level="2" size="medium">
              Tilbakemeldinger
            </Heading>
            <BodyLong spacing>
              Vi setter pris på tilbakemeldinger om feil og mangler. Dette kan meldes til e-postadresse{' '}
              <Link href="mailto:finnhjelpemiddel@nav.no">finnhjelpemiddel@nav.no</Link>. Vi vil så raskt som mulig
              undersøke og utbedre eventuelle feil og mangler.
            </BodyLong>
          </article>
        </div>
      </AnimateLayout>
    </div>
  )
}

export default AboutUs
