import { BodyLong, Heading, Link } from '@/components/aksel-client'

function ToSuppliers() {
  return (
    <div className="about-us-page">
      <div className="about-us-page__container">
        <article>
          <Heading level="1" size="medium" className="spacing-top--small spacing-bottom--medium">
            For leverandører
          </Heading>
          <Heading level="2" size="small" spacing id="hva-er-et-hjelpemiddel">
            Hva er et hjelpemiddel?
          </Heading>
          <BodyLong spacing>
            FinnHjelpemiddel presenterer hjelpemidler på det norske markedet. Det er ikke automatisk samsvar mellom
            folketrygdlovens definisjon av et hjelpemiddel og det som ligger i FinnHjelpemiddel. Det kan derfor finnes
            produkter i FinnHjelpemiddel som Nav ikke kan gi stønad til. I slike tilfeller må kostnadene til produktet
            dekkes av brukeren selv.
          </BodyLong>
          <BodyLong>Produkter som klart faller utenfor hjelpemiddelbegrepet i folketrygdloven er:</BodyLong>
          <ul>
            <li>Vanlige møbler</li>
            <li>Brune- og hvitevarer</li>
            <li>Vanlig kjøkkenutstyr</li>
            <li>Bøker og læremidler</li>
            <li>
              Vanlig treningsutstyr (matter, ribbevegger, balanseutstyr, treningsstrikk, svømme- og flyteutstyr,
              sykkelvogner, terapimaster, treningsbenker, tredemøller m.m.)
            </li>
            <li>Forbruksvarer</li>
            <li>Vanlige spill (også PC-spill)</li>
            <li>
              Vanlige leker (rangler, uro, speilkaruseller, byggeklosser, taktile leker, leker som lager lyd, baller,
              akebrett, krypetuneller m.m.)
            </li>
            <li>
              Klær (med unntak av inkontinensbadetøy, kjørehansker, kjøreposer, regncape for personer i rullestol og
              noen bestemte varmehjelpemidler.)
            </li>
            <li>
              <Link href="https://behandlingshjelpemidler.no/">Behandlingshjelpemidler</Link>
            </li>
          </ul>
          <BodyLong spacing>
            Definisjonen av et hjelpemiddel vil endre seg over tid og kriteriene for registrering i FinnHjelpemiddel vil
            derfor bli vurdert jevnlig. Hjelpemidler som er under utvikling og som ikke er lansert vil ikke bli
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
          <BodyLong spacing>
            {`Leverandørene i FinnHjelpemiddel må være norske, eller ha norske underleverandører. Hjelpemidlene som skal
              registreres må fylle kriteriene for et hjelpemiddel (se over).`}
          </BodyLong>
          <BodyLong spacing>
            Henvendelser eller andre spørsmål om leverandørtilgang kan sendes til{' '}
            <Link href="mailto:finnhjelpemiddel@nav.no">finnhjelpemiddel@nav.no</Link>.
          </BodyLong>
          <Heading level="2" size="small" spacing>
            Kontakt oss
          </Heading>
          <BodyLong spacing>
            Spørsmål, innspill og tilbakemeldinger kan sendes til{' '}
            <Link href="mailto:finnhjelpemiddel@nav.no">finnhjelpemiddel@nav.no</Link>.
          </BodyLong>
        </article>
      </div>
    </div>
  )
}

export default ToSuppliers
