import { Alert, BodyLong, Heading, Link } from '@/components/aksel-client'
import AnimateLayout from '@/components/layout/AnimateLayout'

function AboutUs() {
  return (
    <div className="about-us-page">
      <AnimateLayout>
        <div className="about-us-page__content spacing-top--xlarge spacing-bottom--xlarge">
          <article>
            <Heading level="1" size="xlarge" spacing>
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
              på og utenfor avtale. Det vil si at det også finnes hjelpemidler i denne oversikten som NAV ikke låner ut.
              Denne nettsiden skal erstatte{' '}
              <Link href="https://www.hjelpemiddeldatabasen.no">hjelpemiddeldatabasen.no.</Link>
            </BodyLong>
            <BodyLong spacing>
              Informasjon om produktene du finner her er lagt inn av NAV og av de ulike leverandørene. Du kan ikke søke
              om hjelpemidler fra NAV på denne siden, men vi hjelper deg videre. Dersom du er leverandør og ønsker å
              legge inn dine produkter, ta kontakt med NAV Hjelpemidler og tilrettelegging for mer informasjon:{' '}
              <Link href="mailto:hjelpemiddeldatabasen@nav.no">hjelpemiddeldatabasen@nav.no</Link>
            </BodyLong>
          </article>
          <article>
            <Heading level="2" size="large" spacing className="spacing-top--xlarge">
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