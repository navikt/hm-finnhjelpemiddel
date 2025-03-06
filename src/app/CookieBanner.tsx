import styles from '@/app/CookieBanner.module.scss'
import { InformationSquareFillIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, Heading, Link } from '@navikt/ds-react'
import NextLink from 'next/link'
import React from 'react'

export const CookieBanner = ({
  enableOptionalCookies,
  disableOptionalCookies,
}: {
  enableOptionalCookies: () => void
  disableOptionalCookies: () => void
}) => {
  return (
    <Box className={styles.cookieBanner}>
      <div className={styles.content}>
        <InformationSquareFillIcon className={styles.infoIcon} aria-hidden />
        <section id={'cookie-banner-dialog'} aria-labelledby={'cookie-banner-title'}>
          <div className={styles.textContainer}>
            <Heading size="small" level="2" spacing id={'cookie-banner-title'}>
              Velg hvilke informasjonskapsler FinnHjelpemiddel får bruke
            </Heading>
            <BodyShort>
              Nødvendige informasjonskapsler sørger for at nettstedet fungerer og er sikkert, og kan ikke velges bort.
              Andre brukes til statistikk og analyse. Godkjenner du alle, hjelper du oss å lage bedre nettsider og
              tjenester.
            </BodyShort>
            <Link as={NextLink} href={'/personvern'}>
              Mer om våre informasjonskapsler
            </Link>
          </div>
          <Box className={styles.buttonContainer}>
            <Button className={styles.button} onClick={enableOptionalCookies}>
              Godkjenn alle
            </Button>
            <Button className={styles.button} onClick={disableOptionalCookies}>
              Bare nødvendige
            </Button>
          </Box>
        </section>
      </div>
    </Box>
  )
}

export default CookieBanner
