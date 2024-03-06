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
            <BodyLong spacing>
              Samtlige varemerker, logoer og andre kjennetegn tilhører NAV eller tredjepart. Det er ikke tillatt å
              kopiere eller anvende dem på noen måte uten samtykke fra NAV.
            </BodyLong>
            <BodyLong spacing>
              Alle opplysninger i FinnHjelpemiddel kan bli endret eller oppdatert uten varsel og feil kan forekomme.
            </BodyLong>
            <BodyLong spacing>
              NAV påtar seg ikke ansvaret for innholdet i produktinformasjonen. Bruk av opplysningene skjer på eget
              ansvar. Informasjonen på FinnHjelpemiddel er basert på informasjon gitt av leverandøren av hjelpemiddelet.{' '}
            </BodyLong>
            <BodyLong spacing>
              NAV fraskriver seg et hvert ansvar for direkte eller indirekte tap som er en følge av bruk av
              opplysningene gitt i FinnHjelpemiddel, uavhengig av om tapet skyldes feil, uklare opplysninger, virus
              eller har andre årsaker.
            </BodyLong>
            <BodyLong>
              NAV støtter ikke andre nettsteder som lenkes til FinnHjelpemiddel. NAV påtar seg ikke ansvar for innholdet
              på disse nettstedene.
            </BodyLong>
          </article>
        </div>
      </AnimateLayout>
    </div>
  )
}

export default RightsResponsibilities
