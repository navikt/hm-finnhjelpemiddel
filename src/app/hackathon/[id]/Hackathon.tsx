'use client'

import { Product } from '@/utils/product-util'
import { Accordion, BodyLong, BodyShort, Box, Button, Heading, HStack, VStack } from '@navikt/ds-react'
import styles from './Hackathon.module.css'
import ProductImage from '@/components/ProductImage'
import NextLink from 'next/link'

export const Hackathon = ({ product }: { product: Product }) => {
  return (
    <VStack gap={'10'} className={styles.wrapper}>
      <HStack align={'center'}>
        <Box className={styles.imageWrapper}>
          <ProductImage src={product.photos.at(0)?.uri} productTitle={product.title} />
        </Box>
        <VStack gap={'4'}>
          <Heading size={'small'}>Rullatorer, 4 hjul innendørsbruk, begrenset utebruk</Heading>
          <Heading size={'large'}>{product.title}</Heading>
          <BodyShort>Artnr: 177946</BodyShort>
        </VStack>
      </HStack>
      <VStack gap={'2'}>
        <Heading size={'small'}>Om hjelpemiddelet</Heading>
        <BodyLong style={{ maxWidth: '600px' }}>{product.attributes.text}</BodyLong>
      </VStack>
      <VStack gap={'2'}>
        <VStack gap={'8'} style={{ maxWidth: '600px' }}>
          <Heading size={'large'}>Vanlige problemer</Heading>

          <VStack gap={'4'}>
            <BodyLong>Her finner du forslag til noen ting du kan prøve</BodyLong>
          </VStack>

          <Accordion>
            <Accordion.Item>
              <Accordion.Header>Bremsen virker ikke</Accordion.Header>
              <Accordion.Content>
                Først må du sjekke bremsevaiere. Løsne låseskruen på bremsehendelen, stram vaiere ved å trekke i den, og
                stram låseskruen igjen. Pass på at vaieren ikke er for stram, for da kan hjulet låse seg. Hvis vaieren
                er frynsete eller skadet, må den byttes.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item>
              <Accordion.Header>Hjulet er løst</Accordion.Header>
              <Accordion.Content>
                Hvis et hjul er løst, må du sjekke bolten som fester hjulet til rammen. Stram bolten med en
                unbrakonøkkel og en fastnøkkel (eller tang) på hver side for å hindre at den roterer. Ikke stram for
                hardt, da dette kan hindre hjulet i å rulle fritt. Om hjulet fortsatt er løst, kan kulelageret være
                slitt og må byttes.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item>
              <Accordion.Header>Høyden på håndtakene er feil</Accordion.Header>
              <Accordion.Content>
                Høydejustering er enkelt og krever ingen verktøy. For å justere høyden, trykk inn justeringsknappene på
                sidene av rullatoren og trekk håndtaket opp eller ned til ønsket høyde. Slipp knappen og sjekk at den
                har klikket på plass i et av hullene for å sikre at den er låst.
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>

          <HStack gap={'4'} justify={'space-between'}>
            <Button variant={'secondary'} style={{ width: 'fit-content' }}>
              Bestill deler
            </Button>
            <Button style={{ width: 'fit-content' }}>Meld behov for reparasjon</Button>
          </HStack>
        </VStack>
      </VStack>
      <VStack gap={'8'} style={{ maxWidth: '600px' }}>
        <Heading size={'large'}>Returnering</Heading>
        <BodyLong>
          Dersom du ikke lenger har behov for dette hjelpemiddelet kan du enkelt returnere det selv ved å levere det på
          kommunalt hjelpemiddellager.
        </BodyLong>

        <VStack gap={'6'}>
          <Heading size={'large'}>Hjelpemiddellageret</Heading>
          <VStack gap={'2'}>
            <BodyShort>Bedriftsveien 10</BodyShort>
            <BodyShort>6517 Kristiansund</BodyShort>
          </VStack>
          <VStack gap={'2'}>
            <BodyShort>Tlf: 35232342</BodyShort>
            <BodyShort>Åpningstider: Man - fre 08:00 - 16:00</BodyShort>
          </VStack>

          <BodyLong>
            Hvis du har behov for at hjelpemiddelet skal hentes kan du kontakte Kristiansund kommune for å avtale
            henting gjennom skjema her.
          </BodyLong>
        </VStack>

        <Button variant={'secondary'} style={{ width: 'fit-content' }}>
          Bestill henting
        </Button>
      </VStack>
    </VStack>
  )
}
