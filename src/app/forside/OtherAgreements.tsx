import { Accordion, Box, Heading, HGrid, Link, VStack } from '@navikt/ds-react'
import styles from './OtherAgreements.module.scss'
export const OtherAgreements = () => {
  return (
    <VStack paddingBlock={{ md: 'space-48' }}>
      <Heading size={'medium'} level={'2'} spacing>
        Andre hjelpemiddelavtaler
      </Heading>
      <Accordion className={styles.container}>
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

        <Accordion.Item>
          <Accordion.Header>Høreapparater, ørepropper og tinnitusmaskerere</Accordion.Header>
          <Accordion.Content>
            Her kan du lese mer om{' '}
            <Link href={'/rammeavtale/d73b510b-0043-4c9e-92ac-25b4ace236c9'}>
              høreapparater, ørepropper og tinnitusmaskerere.
            </Link>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Header>Hjelpemidler for seksuallivet</Accordion.Header>
          <Accordion.Content>
            Her kan du lese mer om{' '}
            <Link href={`/rammeavtale/hjelpemidler/768b68d7-9e3a-4865-983e-09b47ecc6a2c`}>
              hjelpemidler for seksuallivet
            </Link>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </VStack>
  )
}
