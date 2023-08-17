import NextLink from 'next/link'

import { mapAgreementFromSearch } from '@/utils/agreement-util'
import { getAgreementFromIdentifier } from '@/utils/api-util'
import { dateToString } from '@/utils/string-util'

import ReadMore from '@/components/ReadMore'
import { BodyLong, BodyShort, ChevronRightIcon, Heading, Link } from '@/components/aksel-client'
import AnimateLayout from '@/components/layout/AnimateLayout'

import AgreementDescription from './AgreementDescription'
import './agreement-page.scss'

export default async function AgreementPage({ params: { id: agreementId } }: { params: { id: string } }) {
  const agreement = mapAgreementFromSearch(await getAgreementFromIdentifier(agreementId))
  const hrefSok = `/sok?agreement=true&rammeavtale=${agreementId}`

  return (
    <div className="agreement-page">
      <AnimateLayout>
        <div className="agreement-page__content spacing-top--xlarge spacing-bottom--xlarge">
          <div className="agreement-page__link-to-search">
            <NextLink href={hrefSok}>
              <Heading level="1" size="medium">
                Se produkter under avtale: Manuelle rullestoler
              </Heading>
            </NextLink>
            <ChevronRightIcon aria-hidden fontSize="1.5rem" />
          </div>
          <article>
            <Heading level="1" size="large">
              {agreement.title}
            </Heading>
            <BodyLong spacing>
              {`Avtaleperiode: fra ${dateToString(agreement.published)} til
             ${dateToString(agreement.expired)}`}
            </BodyLong>

            <AgreementDescription agreement={agreement} />
          </article>
          <article>
            <div>
              <Heading level="1" size="medium">
                Slik kan du se at et hjelpemiddel er på avtale med NAV
              </Heading>
              {/* <Heading level="2" size="small">
                Hvordan man ser at et produkt, tilbehør eller en reservedel er på avtale med NAV:
              </Heading> */}
            </div>
            <div></div>
            <BodyLong spacing>
              Dersom du ønsker råd om hjelpemidler eller har spørsmål til NAV Hjelpemiddelsentral, må du ta kontakt med
              NAV Hjelpemiddelsentral. Kontaktinformasjon til de ulike hjelpemiddelsentralene på{' '}
              <Link href="https://www.nav.no/no/person/hjelpemidler/hjelpemidler-og-tilrettelegging/kontakt-nav-hjelpemiddelsentral">
                nav.no
              </Link>
              . Gjelder det spørsmål eller tilbakemelding om denne nettsiden, kan vi kontaktes på{' '}
              <Link href="mailto:digihot@nav.no">digihot@nav.no.</Link> Unngå å oppgi sensitiv informasjon på e-post.
            </BodyLong>
          </article>
          <article>
            <Heading level="1" size="large" spacing className="spacing-top--xlarge">
              Dokumenter
            </Heading>
            <BodyLong spacing>
              Dersom du ønsker råd om hjelpemidler eller har spørsmål til NAV Hjelpemiddelsentral, må du ta kontakt med
              NAV Hjelpemiddelsentral. Kontaktinformasjon til de ulike hjelpemiddelsentralene på{' '}
              <Link href="https://www.nav.no/no/person/hjelpemidler/hjelpemidler-og-tilrettelegging/kontakt-nav-hjelpemiddelsentral">
                nav.no
              </Link>
              . Gjelder det spørsmål eller tilbakemelding om denne nettsiden, kan vi kontaktes på{' '}
              <Link href="mailto:digihot@nav.no">digihot@nav.no.</Link> Unngå å oppgi sensitiv informasjon på e-post.
            </BodyLong>
          </article>
        </div>
      </AnimateLayout>
    </div>
  )
}
