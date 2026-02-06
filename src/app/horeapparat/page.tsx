import { BodyLong, BodyShort, Heading, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'

export default function Page() {
  return (
    <VStack
      gap={'space-28'}
      paddingBlock={'space-64 space-64'}
      paddingInline={'space-16'}
      marginInline={'auto'}
      marginBlock={'space-0'}
      maxWidth={'600px'}
    >
      <Heading size={'large'} level={'1'}>
        Høreapparater, ørepropper og tinnitusmaskerere
      </Heading>
      <BodyShort>Avtaleperiode: 15-06-2023 - 14-06-2026</BodyShort>
      <BodyLong>
        Høreapparat er et hjelpemiddel som kan bidra til å bedre en persons hørselsfunksjon. Ørepropper i denne
        sammenheng er generiske ørepropper. Det vil si ørepropper som passer til høreapparater fra flere produsenter.
        Tinnitusmaskerer er et hjelpemiddel som kan bidra til å dempe plager ved tinnitus.
      </BodyLong>
      <BodyLong>
        Tilpasning og formidling av høreapparater og tinnitusmaskerere gjøres av audiograf hos avtalespesialist eller
        hørselssentral. Formidling av ørepropper er en del av høreapparattilpasningen og oppfølging av den. Audiografen
        tar avtrykk av øret og bestiller ørepropp når det er nødvendig. Øvrige hørselstekniske hjelpemidler blir
        formidlet via NAV Hjelpemiddelsentral.
      </BodyLong>
      <BodyLong>
        Personer med nedsatt hørsel eller tinnitus må få henvisning fra fastlege til avtalespesialist eller
        hørselssentral for utredning/behandling og søknad.
      </BodyLong>

      <VStack gap={'space-8'}>
        <Heading size={'xsmall'} level={'2'}>
          Rammeavtalen består av 11 delkontrakter
        </Heading>
        <ol style={{ marginBlock: 0, paddingLeft: '30px' }}>
          <li>Mildt til alvorlig hørselstap - høreapparat BTE</li>
          <li>Mildt til alvorlig hørselstap - høreapparat «alt i øret» (ITE)</li>
          <li>Svært stort hørselstap – høreapparat BTE </li>
          <li>Mildt til alvorlig og stort hørselstap barn – høreapparat BTE</li>
          <li>Høreapparat for benledning uten implantat</li>
          <li>Høreapparat for passivt benledningsimplantat med og uten hudgjennomføring</li>
          <li>Høreapparat for aktivt benledningsimplantat uten hudgjennomføring</li>
          <li>Høreapparat for mellomøreimplantat</li>
          <li>Generiske ørepropper – standard sortiment</li>
          <li>Generiske ørepropper – spesialsortiment</li>
          <li>Frittstående tinnitusmaskerer</li>
        </ol>
      </VStack>
      <BodyLong>
        I delkontrakt 1-4 har leverandørene tilbudt produktene i høreapparatfamilier, hvor hver enkelt
        høreapparatfamilie består at ulike varianter og versjoner av høreapparater. I delkontrakt 5-11 er det
        enkeltprodukter. Produktene presenteres ikke med tekst og bilder, men oversikter over alle høreapparater,
        ørepropper og tinnitusmaskerere på avtale.
      </BodyLong>
      <BodyLong>
        Informasjon om leveringstid, frakt og reparasjoner finner du i dokumentet{' '}
        <NextLink href={'https://finnhjelpemiddel.nav.no/imageproxy/file/hmidocfiles/2920106.pdf?r=12062023145255'}>
          Behov- og kravspesifikasjon (PDF)
        </NextLink>
        . Les om garantier i dokumentet{' '}
        <NextLink href={'https://finnhjelpemiddel.nav.no/imageproxy/file/hmidocfiles/8419973.pdf?r=12062023145255'}>
          Rammeavtalen (PDF)
        </NextLink>
        .
      </BodyLong>
      <BodyLong>
        Les også{' '}
        <NextLink href={'https://finnhjelpemiddel.nav.no/imageproxy/file/hmidocfiles/7703403.pdf?r=12062023151542'}>
          &quot;Hvordan velge høreapparat på parallell rammeavtale&quot; (PDF)
        </NextLink>{' '}
        og{' '}
        <NextLink href={'https://finnhjelpemiddel.nav.no/imageproxy/file/hmidocfiles/9652137.pdf?r=13062023092354'}>
          &quot;Når det ikke finnes høreapparat eller ørepropper på rammeavtale som dekker behovet&quot; (PDF)
        </NextLink>
        .
      </BodyLong>
      <VStack gap={'space-8'}>
        <Heading size={'xsmall'} level={'2'}>
          Mer informasjon?
        </Heading>
        <ul style={{ listStyle: '"- "', marginBlock: 0, paddingLeft: '30px' }}>
          <li>
            <NextLink href={'https://www.nav.no/har-nedsatt-horsel'}>På nav.no finner du egne sider om hørsel</NextLink>
            . Her finner du også{' '}
            <NextLink href={'https://lovdata.no/nav/rundskriv/r10-07b?q=rundskriv%20om%20h%C3%B8reapparater'}>
              rundskriv om stønad til høreapparater og tinnitusmaskerer
            </NextLink>
            .
          </li>
          <li>
            På Helsenorge.no finner du informasjon om{' '}
            <NextLink href={'https://tjenester.helsenorge.no/velg-behandlingssted/behandlinger/ventetider-for?bid=20'}>
              offentlige hørselssentraler
            </NextLink>{' '}
            og <NextLink href={'https://www.helsenorge.no/behandlere/avtalespesialist'}>avtalespesialister</NextLink>.
          </li>
          <li>
            På Kunnskapsbanken.net/horsel kan du lese{' '}
            <NextLink href={'https://www.kunnskapsbanken.net/horsel/'}>fagstoff om hørselsnedsettelse</NextLink>.
          </li>
        </ul>
      </VStack>
    </VStack>
  )
}
