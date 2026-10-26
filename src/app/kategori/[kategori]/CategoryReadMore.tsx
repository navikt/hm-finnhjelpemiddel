'use client'

import React from 'react';



import NextLink from 'next/link';



import { BodyLong, Box, Link, ReadMore } from '@navikt/ds-react';



import { logUmamiClickButton, logUmamiNavigationEvent } from '@/utils/umami';














export const CategoryReadMore = () => {
  const lastSubcategoryText = 'Hva betyr Nav-begrepene?'
  const baseUrl = process.env.BUILD_ENV === 'prod' ? 'https://finnhjelpemiddel.nav.no' : ''
  
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
          <li>
            <b>På avtale:</b> Hjelpemidlene som er markert med «På avtale» skal vurderes først.
          </li>
          <li>
            <b>Delkontrakt:</b> Hver avtale er delt inn etter hjelpemidlenes egenskaper, for eksempel rullator for
            utendørs- eller innendørsbruk. Dette kalles delkontrakter.
          </li>
          <li>
            <b>Rangering:</b> Hjelpemidler i en delkontrakt har ulike rangeringer. De som er markert med «Rangering 1»
            skal vurderes først.
          </li>
          <li>
            <b>Ikke på avtale:</b> Hjelpemidlene vil kunne være aktuelle dersom de som er på avtale ikke dekker behovet,
            eller at det ikke finnes en avtale.
          </li>
        </ul>
        <BodyLong>
          Du kan lese mer under{' '}
          <Link
            href={baseUrl + '/om-nettstedet'}
            onClick={() => {
              logUmamiNavigationEvent('subcategory-readmore', linkToNavHowToApply, subCategoryHelpText)
            }}
          >
            «Vanlige spørsmål»
          </Link>
        </BodyLong>
      </ReadMore>
    </Box>
  )
}
