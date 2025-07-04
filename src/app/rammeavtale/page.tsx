import Image from 'next/image'

import { BodyLong, Heading } from '@/components/aksel-client'
import { BodyShort } from '@navikt/ds-react'
import { Metadata } from 'next'
import AgreementList from './AgreementList'

export const metadata: Metadata = {
  title: 'Rammeavtaler',
  description: 'Oversikt over rammeavtaler med Nav',
}

export default async function AgreementsInfoPage() {
  return (
    <div className="agreement-page">
      <div className="agreement-page__content  main-wrapper--medium">
        <article>
          <div className="flex flex--space-between">
            <Heading level="1" size="large" className="spacing-bottom--small">
              Avtaler på hjelpemiddelområdet
            </Heading>
            <Image src="/nav-logo-red.svg" width="65" height="41" alt="" aria-hidden={true} />
          </div>
          <BodyShort spacing>
            {`Nedenfor finner du alle aktive avtaler for Nav Hjelpemidler og tilrettelegging. Under hver avtale finnes tilbehør, reservedeler, tjenester
        og behov- og kravspesifikasjon med mer.`}
          </BodyShort>

          <AgreementList />
        </article>
        <article>
          <Heading level="2" size="medium" id="se-at-et-hjelpemiddel-er-på-avtale" spacing>
            Slik kan du se at et hjelpemiddel er på avtale med Nav
          </Heading>

          <div>
            <Heading level="3" size="small">
              Det står følgende på kortet til hjelpemiddelet:
            </Heading>

            <BodyShort textColor="subtle">Rangering 1</BodyShort>
            <BodyShort spacing>Er på avtale med Nav, og er rangert som nr 1 på sin delkontrakt.</BodyShort>

            <BodyShort textColor="subtle">Rangering 4</BodyShort>
            <BodyShort spacing>Er på avtale med Nav, og er rangert som nr 4 på sin delkontrakt</BodyShort>

            <BodyShort textColor="subtle">På avtale med Nav</BodyShort>
            <BodyShort>Er på avtale med Nav uten rangering.</BodyShort>
          </div>
          <div>
            <Heading level="3" size="small" className="spacing-top--small">
              Hva om hjelpemiddelet ikke har denne merkingen?
            </Heading>
            <BodyLong spacing>
              Det betyr at hjelpemiddelet ikke er på avtale med Nav. Dersom du vil søke om dette hjelpemiddelet, må
              behovet begrunnes godt. Nav Hjelpemiddelsentral vurderer om hjelpemiddelet kan innvilges eller ikke.
            </BodyLong>
            <Heading level="3" size="small">
              Hva om hjelpemiddelet er rangert som nummer 2,3 eller 4?
            </Heading>
            <BodyLong spacing>
              Det betyr at du kan søke om disse hjelpemidlene via Nav, men du må begrunne hvorfor rangeringen(e) foran
              ikke dekker behovet.
            </BodyLong>
            <Heading level="3" size="small">
              Hva vil det si at hjelpemiddelet ikke har rangering?
            </Heading>
            <BodyLong spacing>
              Det betyr at produktet er på avtale med Nav. Dette kan for eksempel være understell til en sittemodul, der
              samme understell passer til sittemoduler i flere rangeringer.
            </BodyLong>
          </div>
        </article>
      </div>
    </div>
  )
}
