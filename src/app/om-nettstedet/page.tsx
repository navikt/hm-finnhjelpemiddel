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
              {`FinnHjelpemiddel er et nettsted som utvikles og driftes av NAV Hjelpemidler og tilrettelegging. Strukturen
              er med fokus på hjelpemidelene som er på avtale med NAV og generell informasjon om avtalene. Hjelpemidler
              som ikke er på avtale presenteres på tilsvarende måte, men uten avtalemerking (se lengre ned).`}
            </BodyLong>
            <BodyLong spacing>
              Alle hjelpemidlene skal være spesiallaget for personer med funksjonsnedsettelse og skal være tilgjengelige
              på det norske markedet.
              <Link href="/til-leverandorer#hva-er-et-hjelpemiddel" className="spacing-top--small">
                Klikk her for mer informasjon om hva et hjelpemiddel er.
              </Link>
            </BodyLong>

            <Heading level="2" size="small" spacing>
              Hjelpemidler på avtale med NAV
            </Heading>
            <BodyLong spacing>
              NAV følger regelverket for offentlige anskaffelser og har inngått avtaler med leverandører av ulike
              hjelpemidler som for eksempel varslingshjelpemidler og manuelle rullestoler. Hver avtale inneholder
              delkontrakter som organiserer hjelpemidlene ut ifra funksjoner. Hver delkontrakt er igjen inndelt i
              rangeringer. For eksempel “Rangering 1” som betyr at hjelpemiddelet må velges dersom det dekker brukerens
              behov. Dersom hjelpemiddelet på rangering 1 ikke kan benyttes må rangering 2 vurderes osv. Dersom et
              hjelpemiddel har mange varianter, som for eksempel flere størrelser, er hver variant som er på avtale
              markert med “På avtale” i tabellvisningen. Det finnes noen få delkontrakter hvor man ikke forholder seg
              til rangering på den nevnte måten. Informasjon om rutiner for disse finnes i de aktuelle
              avtaledokumentene.
            </BodyLong>

            <Heading level="2" size="small" spacing>
              Målgruppe
            </Heading>
            <BodyLong spacing>
              FinnHjelpemiddel er i hovedsak laget for innbyggere, kommunalt ansatte, ansatte i helseforetak og ansatte
              ved hjelpemiddelsentraler som trenger informasjon om hjelpemidler og avtalene med NAV.
            </BodyLong>
            <Heading level="2" size="small" spacing>
              Spørsmål om et hjelpemiddel
            </Heading>
            <BodyLong spacing>
              Hvis du har spørsmål om et hjelpemiddel som du har fått fra NAV eller et du har sett på FinnHjelpemiddel
              kontakter du kommunen du bor i.
            </BodyLong>
            <Heading level="2" size="small" spacing>
              Tilbakemelding på nettstedet
            </Heading>
            <BodyLong className="spacing-bottom--small">
              Tilbakemeldinger om tekniske feil og mangler på nettsiden sendes til{' '}
              <Link href="mailto:finnhjelpemiddel@nav.no">finnhjelpemiddel@nav.no</Link>.
            </BodyLong>
            <BodyLong spacing>
              Hvis du leser dette på en PC, kan du gi oss tilbakemelding ved å klikke på
              &quot;Tilbakemelding&quot;-knappen.
            </BodyLong>
            <BodyLong spacing>
              På nav.no/hjelpemidler finner du mer informasjon om regelverk og hvordan man søker om hjelpemidler.
            </BodyLong>
          </article>
        </div>
      </AnimateLayout>
    </div>
  )
}

export default AboutUs
