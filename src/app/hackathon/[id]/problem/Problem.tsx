'use client'

import { Product } from '@/utils/product-util'
import { Accordion, BodyLong, Button, Heading, HStack, VStack } from '@navikt/ds-react'

export const Problem = ({ product }: { product: Product }) => {
  return (
    <VStack gap={'8'} style={{ maxWidth: '600px' }}>
      <Heading size={'large'}>Har du prøvd disse fiksene?</Heading>

      <VStack gap={'4'}>
        <BodyLong>Her finner du forslag til noen ting du kan prøve</BodyLong>
      </VStack>

      <Accordion>
        <Accordion.Item>
          <Accordion.Header>Bremsen virker ikke</Accordion.Header>
          <Accordion.Content>
            Først må du sjekke bremsevaiere. Løsne låseskruen på bremsehendelen, stram vaiere ved å trekke i den, og
            stram låseskruen igjen. Pass på at vaieren ikke er for stram, for da kan hjulet låse seg. Hvis vaieren er
            frynsete eller skadet, må den byttes.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Header>Hjulet er løst</Accordion.Header>
          <Accordion.Content>
            Hvis et hjul er løst, må du sjekke bolten som fester hjulet til rammen. Stram bolten med en unbrakonøkkel og
            en fastnøkkel (eller tang) på hver side for å hindre at den roterer. Ikke stram for hardt, da dette kan
            hindre hjulet i å rulle fritt. Om hjulet fortsatt er løst, kan kulelageret være slitt og må byttes.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Header>Høyden på håndtakene er feil</Accordion.Header>
          <Accordion.Content>
            Høydejustering er enkelt og krever ingen verktøy. For å justere høyden, trykk inn justeringsknappene på
            sidene av rullatoren og trekk håndtaket opp eller ned til ønsket høyde. Slipp knappen og sjekk at den har
            klikket på plass i et av hullene for å sikre at den er låst.
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
  )
}
