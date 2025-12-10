import { Bleed, BodyLong, Heading, HGrid, Link } from '@navikt/ds-react'
import { Chat2Icon, HatSchoolIcon, LocationPinIcon } from '@navikt/aksel-icons'
import { ReactNode } from 'react'
import styles from './KontaktOss.module.scss'

const KontaktOss = () => {
  return (
    <Bleed marginInline="full" asChild reflectivePadding style={{ backgroundColor: '#F5F9FF' }}>
      <HGrid gap="8" columns={{ xs: 1, md: 3 }} paddingBlock={'24'}>
        <KontaktOssItem
          icon={<Chat2Icon aria-hidden fontSize={'32px'} />}
          title="Kontakt Nav"
          href="https://www.nav.no/kontaktoss"
          description="Skriv med Chatrobot Frida, skriv til oss, eller ring kontaktsenteret i Nav."
        />

        <KontaktOssItem
          icon={<LocationPinIcon aria-hidden fontSize={'32px'} />}
          title="Finn din hjelpemiddelsentral"
          href="https://www.nav.no/kontaktoss#finn-hjelpemiddelsentral"
          description="Finn kontaktinformasjon og les om inn- og utlevering av hjelpemidler."
        />

        <KontaktOssItem
          icon={<HatSchoolIcon aria-hidden fontSize={'32px'} />}
          title="Kunnskapsbanken"
          href="https://www.kunnskapsbanken.net/"
          description="Fagstoff og kurs om hjelpemidler og tilrettelegging."
        />
      </HGrid>
    </Bleed>
  )
}

const KontaktOssItem = ({
  icon,
  title,
  href,
  description,
}: {
  icon: ReactNode
  title: string
  href: string
  description: string
}) => {
  return (
    <HGrid columns={'65px auto'} gap={{ xs: '2', md: '6' }}>
      <div className={styles.icon}>{icon}</div>
      <div className="spacing-top--small">
        <Heading as={Link} href={href} level="4" size="small" spacing>
          {title}
        </Heading>
        <BodyLong>{description}</BodyLong>
      </div>
    </HGrid>
  )
}

export default KontaktOss
