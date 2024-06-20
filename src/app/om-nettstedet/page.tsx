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
            <Heading level="1" size="medium" className="spacing-top--small spacing-bottom--medium">
              Om FinnHjelpemiddel
            </Heading>
            <Heading level="2" size="small" spacing>
              Et nettsted fra NAV
            </Heading>
            <BodyLong className="spacing-bottom--small">
              FinnHjelpemiddel er et nettsted som utvikles og driftes av NAV Hjelpemidler og tilrettelegging. Nettstedet
              inneholder informasjon om hjelpemidler på det norske markedet.
            </BodyLong>
            <BodyLong spacing>
              På FinnHjelpemiddel finner du informasjon om både hjelpemidler som er avtalt med NAV, og de som er
              tilgjengelige på det norske markedet uten avtale med NAV.
            </BodyLong>
            <Heading level="2" size="small" spacing>
              Hjelpemidler på avtale med NAV
            </Heading>
            <BodyLong spacing>
              NAV må følge regelverket for offentlige anskaffelser og har derfor inngått avtaler med leverandører av
              hjelpemidler innen ulike områder. Hjelpemidler som er avtalt med NAV er merket med en grønn markering hvor
              det står "rangering …" og har egne innganger for visning og informasjon.
            </BodyLong>
            <Heading level="2" size="small" spacing>
              Hva er et hjelpemiddel?
            </Heading>
            <BodyLong spacing>
              Et hjelpemiddel er et produkt som er spesiallaget for personer med funksjonsnedsettelse.
            </BodyLong>
            <Heading level="2" size="small" spacing>
              Målgruppe
            </Heading>
            <BodyLong spacing>
              FinnHjelpemiddel er rettet mot innbyggere, kommunalt ansatte, helseforetaksansatte og
              hjelpemiddelsentraler som trenger informasjon om hjelpemidler og rammeavtaler.
            </BodyLong>
            <Heading level="2" size="small" spacing>
              Spørsmål eller problemer med et hjelpemiddel
            </Heading>
            <BodyLong spacing>
              Hvis du har spørsmål eller opplever problemer med et hjelpemiddel, vennligst kontakt din kommune.
            </BodyLong>
            <Heading level="2" size="small" spacing>
              Tilbakemelding på nettstedet
            </Heading>
            <BodyLong className="spacing-bottom--small">
              Vi setter stor pris på tilbakemeldinger angående tekniske feil og mangler på nettsiden. Vennligst gi
              tilbakemelding til <Link href="mailto:finnhjelpemiddel@nav.no">finnhjelpemiddel@nav.no</Link>.
            </BodyLong>
            <BodyLong spacing>
              Hvis du leser dette på en PC, kan du også gi oss tilbakemelding ved å klikke på den blå knappen til høyre,
              merket med "Tilbakemelding".
            </BodyLong>
          </article>
        </div>
      </AnimateLayout>
    </div>
  )
}

export default AboutUs
