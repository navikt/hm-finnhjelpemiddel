import { BodyLong, Heading } from '@/components/aksel-client'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rettigheter og ansvar',
  description: 'Informasjon om rettigheter og ansvar',
}

function RightsResponsibilities() {
  return (
    <div className="about-us-page">
      <div className="about-us-page__container">
        <article>
          <Heading level="1" size="medium" spacing>
            Rettigheter og ansvar
          </Heading>
          <Heading level="2" size="medium" spacing>
            Finnhjelpemiddel: Eierskap og ansvar
          </Heading>
          <BodyLong spacing>
            Innholdet i FinnHjelpemiddel er opphavsrettslig beskyttet. Det må ikke reproduseres, endres, overføres eller
            publiseres helt eller delvis uten samtykke fra Nav.
          </BodyLong>
          <BodyLong>
            Varemerker, logoer og andre kjennetegn tilhører Nav eller tredjepart. Det er ikke tillatt å kopiere eller
            bruke dem uten samtykke fra Nav.
          </BodyLong>
          <ul>
            <li>Opplysninger i FinnHjelpemiddel kan bli endret eller oppdatert uten varsel.</li>
            <li>Feil kan forekomme.</li>
            <li>Nav påtar seg ikke ansvaret for innholdet i produktinformasjonen (se mer informasjon under).</li>
            <li>Bruk av opplysningene skjer på eget ansvar.</li>
            <li>Informasjonen på FinnHjelpemiddel er basert på informasjon gitt av leverandørene.</li>
          </ul>
          <br />
          <Heading level="2" size="medium" spacing>
            Ansvarsforhold
          </Heading>
          <BodyLong spacing>
            Nav fraskriver seg ansvar for direkte eller indirekte tap som er en følge av bruk av opplysningene fra
            FinnHjelpemiddel, uavhengig av om tapet skyldes feil, uklare opplysninger, virus eller har andre årsaker.
            For hjelpemidler på avtale med Nav gjennomgås det en form for kvalitetskontroll i forbindelse med
            anskaffelsesprosessen.
          </BodyLong>
          <BodyLong spacing>
            Nav støtter ikke andre nettsteder som lenkes til fra FinnHjelpemiddel og påtar seg ikke ansvar for innholdet
            på disse nettstedene. Informasjonen du finner om hjelpemidlene, tilbehøret og reservedelene leveres av
            leverandører av hjelpemidler.
          </BodyLong>
          <Heading level="2" size="medium" spacing>
            Klassifisering etter internasjonal standard
          </Heading>
          <BodyLong spacing>
            Alle hjelpemidlene i FinnHjelpemiddel klassifiseres ut ifra internasjonal standard for klassifisering av
            hjelpemidler, ISO 9999. Nav administrerer og validerer klassifiseringen og tildelingen av HMS nr. der det
            finnes.
          </BodyLong>
          <BodyLong spacing>
            Med utgangspunkt i ISO 9999s definisjon av et hjelpemiddel, begrenser FinnHjelpemiddel seg ikke kun til
            hjelpemidler som kan bevilges etter en bestemt lovgivning, eller hjelpemidler som er omfattet av et bestemt
            direktivområde.
          </BodyLong>
        </article>
      </div>
    </div>
  )
}

export default RightsResponsibilities
