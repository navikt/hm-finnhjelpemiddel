import styles from '@/app/CookieBanner.module.scss'
import { InformationSquareFillIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, Heading, Link } from '@navikt/ds-react'
import React from 'react'

export const CookieBanner = () => {
  return (
    <Box className={styles.cookieBanner}>
      <div className={styles.content}>
        <InformationSquareFillIcon className={styles.infoIcon} />
        <div>
          <div className={styles.textContainer}>
            <Heading size="small" level="2" spacing>
              Velg hvilke informasjonskapsler FinnHjelpemiddel får bruke
            </Heading>
            <BodyShort>
              Nødvendige informasjonskapsler sørger for at nettstedet fungerer og er sikkert, og kan ikke velges bort.
              Andre brukes til statistikk og analyse. Godkjenner du alle, hjelper du oss å lage bedre nettsider og
              tjenester.
            </BodyShort>
            <Link>Mer om våre informasjonskapsler</Link>
          </div>
          <Box className={styles.buttonContainer}>
            <Button className={styles.button}>Godkjenn alle</Button>
            <Button className={styles.button}>Bare nødvendige</Button>
          </Box>
        </div>
      </div>
    </Box>
  )
}

export default CookieBanner
