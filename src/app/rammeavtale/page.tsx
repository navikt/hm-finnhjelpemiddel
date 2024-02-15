import Image from 'next/image'

import AgreementIcon from '@/components/AgreementIcon'
import ReadMore from '@/components/ReadMore'
import { BodyLong, Heading } from '@/components/aksel-client'
import AnimateLayout from '@/components/layout/AnimateLayout'

import { Bleed } from '@navikt/ds-react'
import { Metadata } from 'next'
import AgreementList from './AgreementList'
import './agreement-page.scss'

export const metadata: Metadata = {
  title: 'Rammeavtaler',
  description: 'Oversikt over rammeavtaler med Nav',
}

export default async function AgreementsInfoPage() {
  return (
    <div className="agreement-page">
      <AnimateLayout>
        <div className="agreement-page__content  main-wrapper--small">
          <article>
            <div className="flex flex--space-between">
              <Heading level="1" size="large" className="spacing-bottom--small">
                Rammeavtaler på Hjelpemiddelområdet
              </Heading>
              <Image src="/nav-logo.svg" width="65" height="41" alt="" aria-hidden={true} />
            </div>
            <Heading level="2" size="small">
              Om rammeavtaler med NAV
            </Heading>

            <BodyLong>
              NAV har avtale med flere leverandører for å kunne tilby et bredt utvalg av hjelpemidler innenfor noen
              områder. Når et hjelpemiddel er på avtale med NAV så vil det være fremforhandlet en pris og blitt
              gjennomført en kvalitetssikring av hjelpemiddelet.
            </BodyLong>
          </article>
          <article>
            <Heading level="2" size="medium">
              Slik kan du se at et hjelpemiddel er på avtale med NAV
            </Heading>
            <Bleed marginInline="8" asChild>
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
            </Bleed>

            <ReadMore
              content={
                <>
                  <Heading level="3" size="small">
                    Hva om hjelpemiddelet ikke har denne merkingen?
                  </Heading>
                  <BodyLong spacing>
                    Det betyr at hjelpemiddelet ikke er på avtale med NAV. Dersom du vil søke om dette hjelpemiddelet,
                    må behovet begrunnes godt. NAV Hjelpemiddelsentral vurderer om hjelpemiddelet kan innvilges eller
                    ikke.
                  </BodyLong>
                  <Heading level="3" size="small">
                    Hva om hjelpemiddelet er rangert som nummer 2,3 eller 4?
                  </Heading>
                  <BodyLong spacing>
                    Det betyr at du kan søke om disse hjelpemidlene via NAV, men du må begrunne hvorfor rangeringen(e)
                    foran ikke dekker behovet.
                  </BodyLong>
                  <Heading level="3" size="small">
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
          <article>
            <AgreementList />
          </article>
        </div>
      </AnimateLayout>
    </div>
  )
}
