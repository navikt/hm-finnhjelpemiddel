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
              Et nettsted fra Nav
            </Heading>
            <BodyLong spacing>
              {`FinnHjelpemiddel utvikles og driftes av Nav Hjelpemidler og tilrettelegging. Hjelpemidlene som presenteres er
               både hjelpemidler på avtale med Nav og uten avtale. Generell informasjon om alle avtalene presenteres også.`}
            </BodyLong>
            <BodyLong spacing>
              Hjelpemidlene som presenteres er spesiallaget for personer med funksjonsnedsettelse og tilgjengelige på
              det norske markedet.
              <Link href="/til-leverandorer#hva-er-et-hjelpemiddel" className="spacing-top--small">
                Klikk her for mer informasjon om hva et hjelpemiddel er.
              </Link>
            </BodyLong>

            <Heading level="2" size="small" spacing>
              Hjelpemidler på avtale med Nav
            </Heading>
            <BodyLong spacing>
              Nav følger regelverket for offentlige anskaffelser og har avtaler med leverandører av ulike
              hjelpemiddelområder. Dette kan for eksempel være hjelpemidler for varsling, synstekniske hjelpemidler og
              manuelle rullestoler.
            </BodyLong>
            <BodyLong spacing>
              Avtalene deles inn i delkontrakter ut ifra hjelpemidlenes egenskaper. En delkontrakt kan omfatte flere
              hjelpemidler som er inndelt i ulike rangeringer. Hjelpemidler som er rangert som nr. 1 skal velges først.
              Dersom det er nødvendig med et hjelpemiddel som er rangert lavere må dette begrunnes. Det finnes noen få
              delkontrakter hvor man ikke forholder seg til rangeringer. Informasjon om rutiner for disse finnes i de
              aktuelle avtaledokumentene.
            </BodyLong>
            <BodyLong spacing>
              {`Hjelpemidler som kommer i flere varianter (for eksempel størrelser og/eller farger), kan ha noen varianter
              på avtale og noen som ikke er på avtale. Dette synliggjøres i tabellen under egenskaper.`}
            </BodyLong>

            <Heading level="2" size="small" spacing>
              Målgrupper
            </Heading>
            <BodyLong spacing>
              FinnHjelpemiddel er laget for ansatte i kommuner, ansatte i helseforetakene, innbyggere, ansatte ved
              hjelpemiddelsentralene og andre som trenger informasjon om hjelpemidler og om avtalene med Nav.
            </BodyLong>
            <Heading level="2" size="small" spacing>
              Spørsmål om et hjelpemiddel
            </Heading>
            <BodyLong spacing>
              Hvis du har spørsmål om et hjelpemiddel som du har fått fra Nav eller et du har sett på FinnHjelpemiddel
              må du ta kontakt med kommunen din.
            </BodyLong>
            <BodyLong spacing>
              På nav.no/hjelpemidler finner du mer informasjon om regelverk og hvordan man søker om hjelpemidler.
            </BodyLong>
            <Heading level="2" size="small" spacing>
              Innspill og tilbakemeldinger om FinnHjelpemiddel
            </Heading>
            <BodyLong className="spacing-bottom--small">
              Tilbakemeldinger om tekniske feil og mangler på nettsiden sendes til{' '}
              <Link href="mailto:finnhjelpemiddel@nav.no">finnhjelpemiddel@nav.no</Link>. Hvis du leser dette på en PC,
              kan du gi oss tilbakemelding ved å klikke på &quot;Tilbakemelding&quot;-knappen.
            </BodyLong>
          </article>
        </div>
      </AnimateLayout>
    </div>
  )
}

export default AboutUs
