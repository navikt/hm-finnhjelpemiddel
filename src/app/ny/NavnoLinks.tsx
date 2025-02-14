import { Heading, HGrid, Link, VStack } from '@navikt/ds-react'
import styles from './NavnoLinks.module.scss'
import Image from 'next/image'

export const NavnoLinks = () => {
  return (
    <VStack gap={'11'} width={'50rem'}>
      <Heading size={'large'} level={'2'}>
        Informasjon på nav.no
      </Heading>
      <HGrid gap={'4'} columns={2} className={styles.cardContainer}>
        <InfoCard text={'Informasjon om hjelpemidler og tilrettelegging'} url={'https://www.nav.no/om-hjelpemidler'} />
        <InfoCard
          text={'Dette må du vite før du søker som privatperson'}
          url={'https://www.nav.no/om-hjelpemidler#hvem'}
        />
        <InfoCard text={'Slik går du frem når du søker selv'} url={'https://www.nav.no/om-hjelpemidler#hvordan'} />
        <InfoCard text={'Søknad og skjema for hjelpemidler'} url={'https://www.nav.no/soknader'} />
      </HGrid>
    </VStack>
  )
}

const InfoCard = ({ text, url }: { text: string; url: string }) => (
  <HGrid as={Link} href={url} underline={false} gap={'6'} columns={'57px auto'} className={styles.linkCard}>
    <Image src={'/arrow.svg'} width="57" height="57" alt="Illustrasjon" aria-hidden />
    {text}
  </HGrid>
)
