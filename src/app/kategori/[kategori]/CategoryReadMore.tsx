'use client'

import React from 'react'

import { BodyShort, Box, Link, ReadMore } from '@navikt/ds-react'

import { logUmamiClickButton } from '@/utils/umami'

export const CategoryReadMore = () => {
  const lastSubcategoryText = 'Hva betyr begrepene?'

  return (
    <Box maxWidth={'700px'}>
      <ReadMore
        variant={'moderate'}
        size={'large'}
        header={lastSubcategoryText}
        onOpenChange={(open) => {
          logUmamiClickButton(`${lastSubcategoryText}`, 'lastSubcategory-readmore', `${open}`)
        }}
      >
        <BodyShort spacing>
          <b>På avtale:</b> Hjelpemidlene som er markert med «På avtale» skal vurderes først.
        </BodyShort>
        <BodyShort spacing>
          <b>Delkontrakt:</b> Hver avtale er delt inn etter hjelpemidlenes egenskaper, for eksempel rullator for
          utendørs- eller innendørsbruk. Dette kalles delkontrakter.
        </BodyShort>
        <BodyShort spacing>
          <b>Rangering:</b> Hjelpemidler i en delkontrakt har ulike rangeringer. De som er markert med rangering 1 skal
          vurderes først.
        </BodyShort>
        <BodyShort spacing>
          <b>Ikke på avtale:</b> Hjelpemidlene vil kunne være aktuelle dersom de som er på avtale ikke dekker behovet,
          eller at det ikke finnes en avtale.
        </BodyShort>
        <Link href={'/om-nettstedet'}>Les mer om begrepene og regelverket for hjelpemiddelformidling her.</Link>
      </ReadMore>
    </Box>
  )
}
