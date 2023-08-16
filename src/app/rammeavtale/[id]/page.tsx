import { mapAgreementFromSearch } from '@/utils/agreement-util'
import { getAgreementFromIdentifier } from '@/utils/api-util'
import { dateToString } from '@/utils/string-util'

import { BodyLong, Button, ChevronUpIcon, Heading, Link } from '@/components/aksel-client'
import AnimateLayout from '@/components/layout/AnimateLayout'

import FullDescription from './FullDescription'

export default async function AgreementPage({ params: { id: agreementId } }: { params: { id: string } }) {
  const agreement = mapAgreementFromSearch(await getAgreementFromIdentifier(agreementId))

  return (
    <div className="agreement-page">
      <AnimateLayout>
        <div className="agreement-page__content spacing-top--xlarge spacing-bottom--xlarge">
          <article>
            <Heading level="1" size="xlarge" spacing>
              Rammeavtale {agreement.title}
            </Heading>
            <BodyLong spacing>
              {`Avtaleperiode: fra ${dateToString(agreement.published)} til
             ${dateToString(agreement.expired)}`}
            </BodyLong>
            <Heading level="2" size="small" spacing>
              Om avtalen med NAV
            </Heading>
            <BodyLong spacing>
              NAV har avtale med flere leverandører for å kunne skaffe et bredt utvalg av Manuelle rullestoler til
              innbyggerne våres. På denne siden finner du alle produktene som inngår i denne avtalen og dokumenter som
              hører til avtalen. Informasjon om leverandør, tilbehør, reservedeler og mulige tjenester finner man på
              siden til produktene.
            </BodyLong>
            <FullDescription descriptionHtml={agreement.descriptionHtml}></FullDescription>
          </article>
          <article>
            <Heading level="1" size="large" spacing className="spacing-top--xlarge">
              Rangering
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
