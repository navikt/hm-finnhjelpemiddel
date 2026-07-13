import { BodyLong, Heading, Link } from '@/components/aksel-client'
import { Metadata } from 'next'
import { BodyShort } from '@navikt/ds-react'

export const metadata: Metadata = {
  title: 'Om nettstedet',
  description: 'Informasjon om nettstedet',
}

function AboutUs() {
  return (
    <div className="about-us-page">
      <div className="about-us-page__container">
        <article>
          <Heading level="1" size="medium" className="spacing-top--small spacing-bottom--medium">
            Om FinnHjelpemiddel
          </Heading>
          <Heading level="2" size="small" spacing>
            Et nettsted fra Nav
          </Heading>
          <BodyLong spacing>
            FinnHjelpemiddel er et nettsted for alle som ønsker informasjon om hjelpemidler og Navs avtaler med
            leverandører. Nettstedet utvikles og driftes av Nav hjelpemidler og tilrettelegging.
          </BodyLong>
          <Heading level="2" size="small" spacing>
            Hva er et hjelpemiddel?
          </Heading>
          <BodyLong spacing>
            Et hjelpemiddel er et produkt som er spesiallaget for personer med nedsatt funksjon. Hjelpemidlene skal
            kunne hjelpe personer med å håndtere daglige utfordringer og delta i samfunnet. De kan kompensere for
            praktiske problemer som oppstår på grunn av funksjonsnedsettelse.
          </BodyLong>
          <BodyLong spacing>
            Hjelpemidler som er vanlige for alle, eller som kan kjøpes i vanlig handel er ikke hjelpemidler i denne
            sammenhengen. Hva som til enhver tid anses som et hjelpemiddel ut ifra folketrygdloven kan endre seg.
          </BodyLong>
          <Heading level="2" size="small" spacing>
            Hvilke hjelpemidler finnes på FinnHjelpemiddel?
          </Heading>
          <BodyShort>FinnHjelpemiddel inneholder:</BodyShort>
          <ul>
            <li>hjelpemidler som er på avtale med Nav (markert med «på avtale»)</li>
            <li>hjelpemidler som ikke er på avtale med Nav (markert med «ikke på avtale»)</li>
          </ul>
          <BodyLong spacing>
            Derfor kan du finne produkter på nettstedet som ikke dekkes av folketrygden. Formålet er å gi en bred
            oversikt over ulike løsninger og produkter på markedet, også for personer som ønsker å kjøpe hjelpemidler
            selv.
          </BodyLong>
          <Heading level="3" size="small" spacing>
            Mer om hjelpemidler på avtale med Nav
          </Heading>
          <BodyLong spacing>
            Nav inngår avtaler med leverandører gjennom offentlige anskaffelser. Hver avtale deles inn i{' '}
            <b>delkontrakter</b>. En delkontrakt kan inneholde flere hjelpemidler som er inndelt i ulike{' '}
            <b>rangeringer</b>. Hjelpemidler som er rangert som nr. 1 skal vurderes først. Dersom det er nødvendig med
            et hjelpemiddel som er rangert som nr. 2, 3 osv. må dette begrunnes. Noen delkontrakter har ikke rangering.
            Informasjon om dette står i de aktuelle avtalene.
          </BodyLong>
          <BodyLong spacing>
            Et hjelpemiddel kan komme i flere varianter, for eksempel ulike størrelser eller farger. Noen varianter er
            på avtale, mens andre ikke er det. Dette står i oversikten over spesifikasjonene til hver variant.
          </BodyLong>
          <Heading level="2" size="small" spacing>
            Hvem bestemmer hva som presenteres?
          </Heading>
          <BodyLong spacing>
            Nav bestemmer hvilke hjelpemidler som skal presenteres på FinnHjelpemiddel. All informasjonen som for
            eksempel bilder, brosjyrer og spesifikasjoner registreres av leverandørene. Innholdsredaksjonen for
            FinnHjelpemiddel kvalitetssikrer informasjonen før den publiseres.
          </BodyLong>

          <Heading level="2" size="small" spacing>
            Hvem kan få hjelpemidler fra Nav?
          </Heading>
          <BodyShort>For å få hjelpemidler gjennom Nav må enkelte vilkår være oppfylt.</BodyShort>
          <br />
          <BodyShort>De viktigste vilkårene er:</BodyShort>
          <ul>
            <li>Funksjonsvanskene må være varige. Det vil si at vanskene har en varighet på over to år.</li>
            <br />
            <li>Hjelpemiddelet skal kompensere for funksjonstap uavhengig av alder.</li>
            <br />
            <li>
              Man må ha{' '}
              <Link href="https://www.nav.no/no/person/flere-tema/arbeid-og-opphold-i-norge/relatert-informasjon/medlemskap-i-folketrygden">
                medlemskap i folketrygden (nav.no)
              </Link>
              .
            </li>
          </ul>
          <BodyShort>Har du behov for kortvarig utlån av hjelpemidler, må du ta kontakt med din kommune.</BodyShort>
          <BodyShort>
            Du finner{' '}
            <Link href="https://www.nav.no/om-hjelpemidler">
              mer informasjon om hjelpemidler og tilrettelegging på nav.no.
            </Link>
          </BodyShort>
          <br/>

          <Heading level="2" size="small" spacing>
            Trenger du informasjon om et hjelpemiddel?
          </Heading>
          <BodyLong spacing>
            For spørsmål om hjelpemidler fra Nav eller hjelpemidler på dette nettstedet, kontakt din kommune.
          </BodyLong>

          <Heading level="2" size="small" spacing>
            Innspill til innholdet på FinnHjelpemiddel
          </Heading>
          <BodyLong spacing>
            Tilbakemeldinger og innspill sendes til{' '}
            <Link href="mailto:finnhjelpemiddel@nav.no">finnhjelpemiddel@nav.no</Link>.
          </BodyLong>

          <Heading level="2" size="small" spacing>
            Er du leverandør og ønsker å registrere hjelpemidler?
          </Heading>
          <BodyShort spacing>
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
        </article>
      </div>
    </div>
  )
}

export default AboutUs
