'use client'

import React from 'react';



import NextLink from 'next/link';



import { Box, Link, ReadMore } from '@navikt/ds-react';



import { logUmamiClickButton } from '@/utils/umami';































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
        <ul>
          <li>På avtale: Hjelpemidlene som er markert med «På avtale» skal vurderes først.</li>
          <li>
            Delkontrakt: Hver avtale er delt inn etter hjelpemidlenes egenskaper, for eksempel rullator for utendørs-
            eller innendørsbruk. Dette kalles delkontrakter.
          </li>
          <li>
            Rangering: Hjelpemidler i en delkontrakt har ulike rangeringer. De som er markert med rangering 1 skal
            vurderes først.
          </li>
          <li>
            Ikke på avtale: Hjelpemidlene vil kunne være aktuelle dersom de som er på avtale ikke dekker behovet, eller
            at det ikke finnes en avtale.
          </li>
        </ul>
        Trenger du mer informasjon om begrepene og regelverket for hjelpemiddelformidling?
        <Link as={NextLink} href="/om-nettstedet">Les mer på finnhjelpemiddel.no - om nettstedet</Link>
      </ReadMore>
    </Box>
  )
}
