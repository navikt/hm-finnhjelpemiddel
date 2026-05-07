'use client'

import { Box, ReadMore } from '@navikt/ds-react'
import React from 'react'
import { logUmamiClickButton } from '@/utils/umami'

export const CategoryReadMore = () => {
  const lastSubcategoryText = 'Hva betyr «På avtale» og «Rangering»?'

  return (
    <Box maxWidth={'500px'}>
      <ReadMore
        variant={'moderate'}
        size={'large'}
        header={lastSubcategoryText}
        onOpenChange={(open) => {
          logUmamiClickButton(`${lastSubcategoryText}`, 'lastSubcategory-readmore', `${open}`)
        }}
      >
        Alle hjelpemidlene på FinnHjelpemiddel som er på avtale er markert med «På avtale». I tillegg er de markert med
        «Delkontrakt» og «Rangering». I mange tilfeller er det nyttig å samarbeide med en fagperson i kommunen for å
        komme frem til det til det mest hensiktsmessige hjelpemidlet, og å skrive selve søknaden.
        <ul>
          <li>
            Delkontrakt: Avtalene inndeles i delkontrakter ut ifra hjelpemidlenes egenskaper. Å lese teksten i
            delkontrakten kan gjøre det lettere for deg å finne det du er ute etter.
          </li>
          <li>
            Rangering: En delkontrakt omfatter som regel flere hjelpemidler. Disse er inndelt i rangeringer. Du må
            alltid starte med å vurdere om hjelpemidlet som er markert med «Rangering 1» dekker ditt behov. Dersom det
            ikke gjøre det må det begrunnes i søknaden.
          </li>
        </ul>
      </ReadMore>
    </Box>
  )
}
