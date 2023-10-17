import AgreementIcon from '@/components/AgreementIcon'
import ReadMore from '@/components/ReadMore'
import { BodyLong, Heading } from '@/components/aksel-client'
import AnimateLayout from '@/components/layout/AnimateLayout'

import './agreement-page.scss'

export default async function AgreementsInfoPage() {
  // const agreements = mapAgreementFromSearch(await getAgreementFromId())
  // const hrefSok = `/sok?agreement=true&rammeavtale=${agreement?.label}`

  return (
    <>
      <div className="agreement-page">
        <AnimateLayout>
          <div className="agreement-page__content spacing-top--large spacing-bottom--xlarge">
            <article>
              <div>
                <Heading level="1" size="large" className="spacing-bottom--small">
                  Avtaler
                </Heading>
              </div>
              <Heading level="2" size="small">
                Om avtalen med NAV
              </Heading>

              <BodyLong>
                NAV har avtale med flere leverandører for å kunne tilby et bredt utvalg av hjelpemidler innenfor
                området. På denne siden finner du informasjon om avtalen, dokumenter, tilbehør, eventuelle tjenester og
                reservedeler. Informasjon om leverandør finner man på siden til hjelpemiddelet
              </BodyLong>
            </article>
            <article>
              <Heading level="1" size="medium">
                Slik kan du se at et hjelpemiddel er på avtale med NAV
              </Heading>

              <div className="agreement-page__icon-containers">
                <div className="agreement-page__icon-container">
                  <AgreementIcon rank={1} />
                  <BodyLong>Er på avtale med NAV, og er rangert som nr 1 på sin delkontrakt.</BodyLong>
                </div>
                <div className="agreement-page__icon-container">
                  <AgreementIcon rank={4} />
                  <BodyLong>Er på avtale med NAV, og er rangert som nr 4 på sin delkontrakt.</BodyLong>
                </div>
                <div className="agreement-page__icon-container">
                  <AgreementIcon rank={99} />
                  <BodyLong>Er på avtale med NAV uten rangering.</BodyLong>
                </div>
              </div>

              <ReadMore
                content={
                  <>
                    <Heading level="2" size="small">
                      Hva om hjelpemiddelet ikke har denne merkingen?
                    </Heading>
                    <BodyLong spacing>
                      Det betyr at hjelpemiddelet ikke er på avtale med NAV. Dersom du vil søke om dette hjelpemiddelet,
                      må behovet begrunnes godt. NAV Hjelpemiddelsentral vurderer om hjelpemiddelet kan innvilges eller
                      ikke.
                    </BodyLong>
                    <Heading level="2" size="small">
                      Hva om hjelpemiddelet er rangert som nummer 2,3 eller 4?
                    </Heading>
                    <BodyLong spacing>
                      Det betyr at du kan søke om disse hjelpemidlene via NAV, men du må begrunne hvorfor rangeringen(e)
                      foran ikke dekker behovet.
                    </BodyLong>
                    <Heading level="2" size="small">
                      Hva vil det si at hjelpemiddelet ikke har rangering?
                    </Heading>
                    <BodyLong spacing>
                      Det betyr at produktet er på avtale med NAV. Dette kan for eksempel være understell til en
                      sittemodul, der samme understell passer til sittemoduler i flere rangeringer.
                    </BodyLong>
                  </>
                }
                buttonOpen={'Les mer'}
                buttonClose={'Les mindre'}
              />
            </article>
          </div>
        </AnimateLayout>
      </div>
    </>
  )
}
