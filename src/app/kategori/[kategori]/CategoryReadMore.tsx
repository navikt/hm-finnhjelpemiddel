'use client'

import React from 'react'

import { Box, Link, ReadMore } from '@navikt/ds-react'

import { logUmamiClickButton } from '@/utils/umami'

export const CategoryReadMore = () => {
  const lastSubcategoryText = 'Hva betyr begrepene?'

  return (
    <Box maxWidth={'600px'}>
      <ReadMore
        variant={'moderate'}
        size={'large'}
        header={lastSubcategoryText}
        onOpenChange={(open) => {
          logUmamiClickButton(`${lastSubcategoryText}`, 'lastSubcategory-readmore', `${open}`)
        }}
      >
        <b>På avtale:</b> Nav inngår avtaler med leverandører av hjelpemidler. Hjelpemidler på avtale skal avhjelpe de
        fleste behov som følge av en funksjonsnedsettelse, og skal vurderes først i en søknadsprosess. Hjelpemidler på
        avtale er merket med «På avtale» i tillegg til informasjon om hvilken delkontrakt og rangering det har (se
        forklaring lengre ned).
        <br />
        <br />
        <b>Ikke på avtale:</b> Formålet med FinnHjelpemiddel er å gi en bred oversikt over hjelpemidler som er på
        markedet, også for personer som ønsker å kjøpe hjelpemidler selv. FinnHjelpemiddel inneholder derfor også
        hjelpemidler som ikke er på avtale. Disse er merket med «Ikke på avtale”.
        <br />
        <br />
        <b>Delkontrakt:</b> Avtalene er inndelt i delkontrakter ut ifra hjelpemidlenes egenskaper. Hjelpemidler på
        avtale er markert med delkontrakten de tilhører.
        <br />
        <br />
        <b>Rangering:</b> En delkontrakt kan ha hjelpemidler med flere rangeringer. Hjelpemidler med rangering 1 skal
        vurderes først. Dersom dette hjelpemiddelet ikke dekker behovet, skal rangering 2 vurderes. Videre etterfulgt av
        rangering 3, og så videre. Hvis et hjelpemiddel med høyere rangering er nødvendig, må det begrunnes hvorfor ikke
        behovet avhjelpes med et lavere rangert hjelpemiddel. Hjelpemidler på avtale er markert med hvilken rangering de
        tilhører.
        <br />
        <br />
        <Link href={'https://www.nav.no/om-hjelpemidler#generelt-om-hjelpemidler'}>
          På nav-sidene for privatpersoner finner du informasjon om rettigheter.
        </Link>
        <Link href={'https://www.nav.no/samarbeidspartner'}>
          På nav-sidene for samarbeidspartnere finner du blant annet søknader og skjema.
        </Link>
      </ReadMore>
    </Box>
  )
}
