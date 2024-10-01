import { BodyLong, Heading } from '@/components/aksel-client'
import AnimateLayout from '@/components/layout/AnimateLayout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rettigheter og ansvar',
  description: 'Informasjon om rettigheter og ansvar',
}

function RightsResponsibilities() {
  return (
    <div className="about-us-page">
      <AnimateLayout>
        <div className="about-us-page__container">
          <article>
            <Heading level="1" size="medium" spacing>
              Rettigheter og ansvar
            </Heading>
            <BodyLong spacing>
              Innholdet i FinnHjelpemiddel er opphavsrettslig beskyttet. Det må ikke reproduseres, endres, overføres
              eller publiseres helt eller delvis uten samtykke fra NAV.
            </BodyLong>
            <BodyLong>
              Varemerker, logoer og andre kjennetegn tilhører Nav eller tredjepart. Det er ikke tillatt å kopiere eller
              bruke dem uten samtykke fra NAV.
            </BodyLong>
            <ul>
              <li>Opplysninger i FinnHjelpemiddel kan bli endret eller oppdatert uten varsel.</li>
              <li>Feil kan forekomme.</li>
              <li>Nav påtar seg ikke ansvaret for innholdet i produktinformasjonen.</li>
              <li>Bruk av opplysningene skjer på eget ansvar.</li>
              <li>Informasjonen på FinnHjelpemiddel er basert på informasjon gitt av leverandører av hjelpemidler.</li>
              <li>
                Nav fraskriver seg ansvar for direkte eller indirekte tap som er en følge av bruk av opplysningene gitt
                i FinnHjelpemiddel, uavhengig av om tapet skyldes feil, uklare opplysninger, virus eller har andre
                årsaker.
              </li>
              <li>
                Nav støtter ikke andre nettsteder som lenkes til fra FinnHjelpemiddel og påtar seg ikke ansvar for
                innholdet på disse nettstedene.
              </li>
            </ul>
          </article>
        </div>
      </AnimateLayout>
    </div>
  )
}

export default RightsResponsibilities
