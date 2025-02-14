import { Bleed, BodyLong, Heading, HGrid, Link } from '@navikt/ds-react'
import { Chat2Icon, HatSchoolIcon, LocationPinIcon } from '@navikt/aksel-icons'

const KontaktOss = () => {
  return (
    <Bleed marginInline="full" asChild reflectivePadding>
      <div className="home-page__kontakt-oss">
        <HGrid gap="8" columns={{ xs: 1, md: 3 }}>
          <HGrid columns={'65px auto'} gap={{ xs: '2', md: '6' }}>
            <div className="home-page__kontakt-oss-icon">
              <Chat2Icon aria-hidden fontSize={'32px'} />
            </div>
            <div className="spacing-top--small">
              <Heading level="4" size="small" className="spacing-bottom--medium">
                <Link href="https://www.nav.no/kontaktoss" className="home-page__link">
                  Kontakt Nav
                </Link>
              </Heading>
              <BodyLong>Skriv med Chatrobot Frida, skriv til oss, eller ring kontaktsenteret i Nav.</BodyLong>
            </div>
          </HGrid>
          <HGrid columns={'65px auto'} gap={{ xs: '2', md: '6' }}>
            <div className="home-page__kontakt-oss-icon">
              <LocationPinIcon aria-hidden fontSize={'32px'} />
            </div>
            <div className="spacing-top--small">
              <Heading level="4" size="small" className="spacing-bottom--medium">
                <Link href="https://www.nav.no/kontaktoss#finn-hjelpemiddelsentral" className="home-page__link">
                  Finn din hjelpemiddelsentral
                </Link>
              </Heading>
              <BodyLong>Finn kontaktinformasjon og les om inn- og utlevering av hjelpemidler.</BodyLong>
            </div>
          </HGrid>

          <HGrid columns={'65px auto'} gap={{ xs: '2', md: '6' }}>
            <div className="home-page__kontakt-oss-icon">
              <HatSchoolIcon aria-hidden fontSize={'32px'} />
            </div>
            <div className="spacing-top--small">
              <Heading level="4" size="small" className="spacing-bottom--medium">
                <Link href="https://www.kunnskapsbanken.net/" className="home-page__link">
                  Kunnskapsbanken
                </Link>
              </Heading>
              <BodyLong>Fagstoff og kurs om hjelpemidler og tilrettelegging.</BodyLong>
            </div>
          </HGrid>
        </HGrid>
      </div>
    </Bleed>
  )
}

export default KontaktOss
