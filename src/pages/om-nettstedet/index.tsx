import React from 'react'

import { Alert, BodyLong, Heading, Link } from '@navikt/ds-react'
import AnimateLayout from '@/components/layout/AnimateLayout'

function AboutUs() {
  return (
    <div className="about-us-page">
      <AnimateLayout>
        <div className="about-us-page__content spacing-top--xlarge spacing-bottom--xlarge">
          <article className="about-us-page max-width">
            <Heading level="1" size="large" spacing>
              Om nettstedet
            </Heading>
            <Alert variant="warning" className="spacing-bottom--large">
              <BodyLong>
                Dette er bare en prototype til testing og utvikling. Her er lenken til{' '}
                <Link href="https://www.hjelpemiddeldatabasen.no">hjelpemiddeldatabasen.no</Link> om du har kommet feil.
              </BodyLong>
            </Alert>
            <BodyLong spacing>
              Finnhjelpemidler er en tjeneste levert av NAV. Her kan du finne produkter, tilbehør og reservedeler både
              på og utenfor rammeavtale. Denne nettsiden skal erstatte{' '}
              <Link href="https://www.hjelpemiddeldatabasen.no">hjelpemiddeldatabasen.no.</Link>
            </BodyLong>
            <BodyLong spacing>
              Informasjon om produktene du finner her er lagt inn av NAV og av de ulike leverandørene. Dersom du er
              leverandør og ønsker å legge inn dine produkter, ta kontakt med NAV Hjelpemidler og tilrettelegging for
              mer informasjon: <Link href="mailto:hjelpemiddeldatabasen@nav.no">hjelpemiddeldatabasen@nav.no</Link>
            </BodyLong>
          </article>
          <article className="contact-us max-width">
            <Heading level="1" size="large" spacing className="spacing-top--xlarge">
              Kontakt oss
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

export default AboutUs
