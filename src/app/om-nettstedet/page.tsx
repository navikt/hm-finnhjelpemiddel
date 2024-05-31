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
          <article>
            <Heading level="1" size="medium" spacing>
              Om Finnhjelpemiddel
            </Heading>
            <Heading level="2" size="small">
              En nav tjeneste
            </Heading>
            <BodyLong spacing>
              FinnHjelpemiddel er en NAV tjeneste og tilbyr en oversikt over alle tilgjengelige hjelpemidler på det
              norske markedet. Nettsiden og tjenesten eies og driftes av NAV Hjelpemidler og tilrettelegging.
            </BodyLong>
            <BodyLong spacing>
              På FinnHjelpemiddel finner du informasjon om hjelpemidler som er på avtale med NAV og andre hjelpemidler
              som er tilgjengelige på det norske markedet uten avtale.
            </BodyLong>
            <Heading level="2" size="small">
              Hjelpemidler på avtale med NAV
            </Heading>
            <BodyLong spacing>
              NAV må følge regelverket for offentlige anskaffelser og har derfor inngått avtaler med leverandører av
              hjelpemidler innen ulike områder. Hjelpemidlene som er på avtale med NAV er market og har egne innganger
              for visning og informasjon.
            </BodyLong>
            <Heading level="2" size="small">
              Hva er et hjelpemiddel?
            </Heading>
            <BodyLong spacing>
              Et hjelpemiddel er et produkt som er spesiallaget for personer med funksjonsnedsettelse.
            </BodyLong>
            <Heading level="2" size="small">
              Målgruppe
            </Heading>
            <BodyLong spacing>
              FinnHjelpemiddel henvender seg til innbyggere, kommuner, leverandører og hjelpemiddelsentraler som har
              behov for eller arbeider med hjelpemidler.
            </BodyLong>
            <Heading level="2" size="small">
              Tekniske feil og mangler
            </Heading>
            <BodyLong spacing>
              Vi setter stor pris på tilbakemeldinger angående tekniske feil og mangler på nettsiden. Vennligst gi
              tilbakemelding til <Link href="mailto:finnhjelpemiddel@nav.no">finnhjelpemiddel@nav.no</Link> eller trykk
              på den blå knappen på høyre side.
            </BodyLong>
            <Heading level="2" size="small">
              Spørsmål eller problemer
            </Heading>
            <BodyLong spacing>
              Ved spørsmål eller problemer angående et hjelpemiddel, vennligst kontakt din kommune eller nærmeste{' '}
              <Link href="https://www.nav.no/no/person/hjelpemidler/hjelpemidler-og-tilrettelegging/kontakt-nav-hjelpemiddelsentral">
                hjelpemiddelsentral
              </Link>{' '}
              for assistanse.
            </BodyLong>
          </article>
        </div>
      </AnimateLayout>
    </div>
  )
}

export default AboutUs
