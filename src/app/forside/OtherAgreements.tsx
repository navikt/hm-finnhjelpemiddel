import { Accordion, Heading, HGrid, Link, Show, VStack } from '@navikt/ds-react'

export const OtherAgreements = () => {
  const AccordionItems1 = () => {
    return (
      <>
        <Accordion.Item>
          <Accordion.Header>Bil og bilombygg</Accordion.Header>
          <Accordion.Content>
            Gir økonomisk støtte til bil, tilpasning av bil og spesialutstyr til bil. Her kan du lese mer om{' '}
            <Link href="https://www.nav.no/bilstonad">bilstønad</Link>.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Header>Førerhund</Accordion.Header>
          <Accordion.Content>
            Hjelper deg å ta deg frem innendørs og utendørs når du er blind eller svært svaksynt. Her kan du lese mer om{' '}
            <Link href="https://www.nav.no/forerhund">førerhund</Link>.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Header>Servicehund</Accordion.Header>
          <Accordion.Content>
            Hjelper deg i hverdagen når du har fysiske funksjonsnedsettelser. Her kan du lese mer om{' '}
            <Link href="https://www.nav.no/servicehund">servicehund</Link>.
          </Accordion.Content>
        </Accordion.Item>
      </>
    )
  }

  const AccordionItems2 = () => {
    return (
      <>
        <Accordion.Item>
          <Accordion.Header>Høreapparater, ørepropper og tinnitusmaskerere</Accordion.Header>
          <Accordion.Content>
            Her kan du lese mer om{' '}
            <Link href="https://www.hjelpemiddeldatabasen.no/news.asp?newsid=8734&x_newstype=7">
              høreapparater, ørepropper og tinnitusmaskerere.
            </Link>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Header>Hjelpemidler for seksuallivet</Accordion.Header>
          <Accordion.Content>
            Her kan du lese mer om{' '}
            <Link href="https://www.hjelpemiddeldatabasen.no/news.asp?newsid=8669&x_newstype=7">
              hjelpemidler for seksuallivet
            </Link>
            .
          </Accordion.Content>
        </Accordion.Item>
      </>
    )
  }

  return (
    <VStack paddingBlock={{ xs: '9', md: '12' }}>
      <Heading size={'medium'} level={'2'} spacing>
        Andre hjelpemiddelavtaler
      </Heading>
      <Show above={'lg'}>
        <HGrid columns={'1fr 1fr'} gap={'8'}>
          <Accordion>
            <AccordionItems1 />
          </Accordion>
          <Accordion>
            <AccordionItems2 />
          </Accordion>
        </HGrid>
      </Show>
      <Show below={'lg'}>
        <Accordion>
          <AccordionItems1 />
          <AccordionItems2 />
        </Accordion>
      </Show>
    </VStack>
  )
}
