import { BodyLong, Heading } from '@/components/aksel-client'
import { Metadata } from 'next'
import { Link } from '@navikt/ds-react'

export const metadata: Metadata = {
  title: 'Personvern',
  description: 'Personvern på FinnHjelpemiddel',
}

function CookieInfo() {
  return (
    <div className="about-us-page">
      <div className="about-us-page__container">
        <article>
          <Heading level="1" size="large" spacing>
            Personvernerklæring for FinnHjelpemiddel
          </Heading>
          <BodyLong spacing>
            FinnHjelpemiddel er en nettside NAV Arbeids- og velferdsdirektoratet har behandlingsansvaret for.
          </BodyLong>
          <BodyLong spacing>
            Denne personvernerklæringen er knyttet til behandlingen av personopplysninger på dette nettstedet. For
            utfyllende informasjon om hvordan NAV behandler dine personopplysninger, kan du lese mer i
            <Link href={'https://www.nav.no/personvern'}> NAVs generelle personvernerklæring</Link>.
          </BodyLong>
          <Heading level="2" size="medium" spacing>
            Informasjonskapsler
          </Heading>
          <BodyLong spacing>
            Her finner du en oversikt over FinnHjelpemiddels bruk av informasjonskapsler (cookies). Informasjonskapsler
            er små tekstfiler som plasseres på din datamaskin når du laster ned en nettside.
          </BodyLong>
          <BodyLong spacing>
            Vi bruker i dag informasjonskapsler til følgende formål:
            <ul>
              <li>For at ulike tjenester på nettsiden vår skal fungere.</li>
              <li>For statistikk og analyse.</li>
            </ul>
            Statistikk og analyse-informasjonskapslene brukes for å forbedre nettsidene og tjenestene våre. Ved å
            godkjenne disse, hjelper du oss i arbeidet med å lage gode, brukervennlige nettsider og tjenester. Når du
            besøker finnhjelpemiddel.nav.no installerer vi informasjonskapsler som er nødvendige for at du skal kunne
            benytte deg av nettsidene våre. Dersom du gir samtykke, kan vi også bruke informasjonskapsler til statistikk
            og analyse. Se oversikt over valgfrie og nødvendige informasjonskapsler nedenfor. Du kan trekke tilbake
            samtykket når som helst.
          </BodyLong>
          <BodyLong spacing>
            Bruk av informasjonskapsler reguleres i{' '}
            <a href={'https://lovdata.no/dokument/NL/lov/2024-12-13-76/KAPITTEL_3#KAPITTEL_3'}>ekomloven § 3-15</a>.
          </BodyLong>
          <Heading level={'3'} size={'small'}>
            Nødvendige informasjonskapsler
          </Heading>
          <BodyLong spacing>
            <ul>
              <li>
                finnhjelpemiddel-consent
                <br />
                Brukes til å administrere brukerenes samtykke. Den lagrer informasjon om hvorvidt du har takket ja eller
                nei til cookies.
              </li>
              <li>
                restore-scroll-search-results
                <br />
                Brukes til å avgjøre hvor på siden du havner når du går tilbake til søkeresultatene.
              </li>
            </ul>
          </BodyLong>
          <Heading level={'3'} size={'small'} spacing>
            Frivillige informasjonskapsler
          </Heading>
          <BodyLong spacing>
            Her ser du navn på informasjonskapslene vi bruker og en beskrivelse av hva de brukes til. Stjerne (*) bak
            navnet betyr alle informasjonskapsler som har navn som starter med det.
            <ul>
              <li>
                AMP_*
                <br />
                Brukes til statistikk og analyse av hvordan nav.no brukes i verktøyet Amplitude. Statistikken er
                anonymisert og kan ikke spores til deg som enkeltperson, men vi kan se tidspunkt, landsdel, type
                nettleser og hvilke sider som er besøkt. For å hindre identifisering, bruker vi en egenutviklet proxy
                som vasker bort deler av IP-adressen din før dataene sendes til verktøyet.
              </li>
              <li>
                _hj*
                <br />
                Brukes til frivillige brukerundersøkelser via verktøyet HotJar. Dataene inneholder en teknisk ID som
                husker hvilken invitasjon som eventuelt har blitt vist, om du har takket ja til invitasjonen og om
                undersøkelsen er ferdig besvart.
              </li>
              <li>
                Umami
                <br />
                Brukes til statistikk og analyse av hvordan nav.no brukes. Unami bruker ikke informasjonskapsler, men
                henter inn opplysninger om nettleseren din for å lage en unik ID. Denne ID-en brukes for å skille deg
                fra andre brukere. For å hindre identifisering, bruker vi en egenutviklet proxy som vasker bort deler av
                IP-adressen din før dataene sendes til verktøyet.
              </li>
              <li>
                usertest-*
                <br />
                Brukes til frivillige brukerundersøkelser via tjenesten UX Signals. Dataene inneholder en teknisk ID som
                husker hvilken variant (feks A, B eller C) av en undersøkelse som du eventuelt har blitt trukket ut til,
                slik at kun den ene varianten åpnes dersom du senere velger å bli med.
              </li>
            </ul>
          </BodyLong>
          <Heading size={'medium'} level={'2'} spacing>
            Administrere cookies
          </Heading>
          <BodyLong spacing>
            Dersom du har godtatt eller reservert deg mot informasjonskapsler på FinnHjelpemiddel, kan du endre disse
            innstillingene ved å klikke på «Endre samtykke for informasjonskapsler» nederst på alle sider.
          </BodyLong>
          <Heading level={'2'} size={'medium'} spacing>
            Informasjonskapsler fra andre nav.no-nettsteder
          </Heading>
          <BodyLong spacing>
            Hvis du har avslått informasjonskapsler hos oss, men godtatt informasjonskapsler på en annen nav-side, så
            kan disse informasjonskapslene dukke opp hos oss. Du kan finne mer informasjon om de på{' '}
            <a href={'https://www.nav.no/informasjonskapsler'}>nav.no sin side om informasjonskapsler</a>.
          </BodyLong>
        </article>
      </div>
    </div>
  )
}

export default CookieInfo
