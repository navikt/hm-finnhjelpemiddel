import { BodyLong, Heading, Link } from '@/components/aksel-client'
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
          <Heading level="2" size="small" spacing>
            Finnhjelpemiddel: Eierskap og ansvar
          </Heading>
          <BodyLong spacing>
            Innholdet på FinnHjelpemiddel er beskyttet av opphavsrett som vil si at det ikke reproduseres, endres,
            overføres eller publiseres uten samtykke fra Nav.
          </BodyLong>
          <BodyLong>
            Varemerker, logoer og andre kjennetegn tilhører Nav eller tredjepart. Det er ikke tillatt å kopiere eller
            bruke dem uten samtykke fra Nav.
          </BodyLong>
          <ul>
            <li>Opplysninger på FinnHjelpemiddel kan bli endret eller oppdatert uten varsel.</li>
            <br />
            <li>Feil kan forekomme.</li>
            <br />
            <li>Nav påtar seg ikke ansvaret for innholdet i produktinformasjonen.</li>
            <br />
            <li>Bruk av opplysningene skjer på eget ansvar.</li>
            <br />
            <li>Informasjonen om hjelpemidlene er basert på informasjon gitt av leverandørene.</li>
          </ul>
          <br />
          <Heading level="2" size="small" spacing>
            Ansvarsforhold
          </Heading>
          <BodyLong spacing>
            Nav fraskriver seg ansvar for direkte eller indirekte økonomiske tap som følge av bruk av opplysningene fra
            Finnhjelpemiddel, uavhengig av om tapet skyldes feil, uklare opplysninger, datavirus eller har andre
            årsaker.
          </BodyLong>
          <BodyLong spacing>
            Nav støtter ikke nettsteder som lenkes til fra FinnHjelpemiddel og påtar seg ikke ansvar for innholdet på
            disse nettstedene. Unntak er lenker til nav.no og Kunnskapsbanken.net, som også eies og driftes av Nav.
          </BodyLong>
          <Heading level="2" size="small" spacing>
            Bruk av internasjonal standard – ISO 9999
          </Heading>
          <BodyLong spacing>
            Hjelpemidler på FinnHjelpemiddel, er kategorisert etter Norsk Standard «NS-EN ISO 9999 - Hjelpemidler –
            klassifisering og terminologi». Standarden er basert på oversettelse fra engelsk utført av{' '}
            <Link href="https://online.standard.no/ns-en-iso-9999-2022">Standard Norge</Link>.
          </BodyLong>
        </article>
      </div>
    </div>
  )
}

export default RightsResponsibilities
