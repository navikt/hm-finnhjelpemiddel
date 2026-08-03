'use client'

import { getCookie } from '@/app/layoutProvider'
import { localStorageProductPageBeta } from '@/app/produkt-test/[id]/ProductTestPage'

import { useState } from 'react'

import { BodyShort, Box, Button, HStack, Link, VStack } from '@navikt/ds-react'

import { logUmamiClickButton } from '@/utils/umami'

interface FeedbackBlockProps {
  setBetaEnabled: (value: string) => void
}

export const FeedbackBlock = ({ setBetaEnabled }: FeedbackBlockProps) => {
  const [expandFeedback, setExpandFeedback] = useState(false)

  const [consent] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return getCookie('finnhjelpemiddel-consent')
    } else {
      return 'pending'
    }
  })

  return (
    <Box
      as={VStack}
      gap={'space-24'}
      paddingBlock={'space-16'}
      paddingInline={'space-32'}
      background={'warning-soft'}
      width={{ xs: '100%', sm: '500px' }}
      borderRadius={'8'}
      borderColor={'warning-subtle'}
      borderWidth={'1'}
      style={{ alignSelf: 'center' }}
    >
      <VStack gap={'space-16'} justify={'space-between'}>
        {!expandFeedback && (
          <BodyShort>
            Vi har gjort siden mer oversiktlig, for å enklere finne riktig variant.
            {consent && ' Gi oss gjerne tilbakemeldinger på endringene.'}
          </BodyShort>
        )}
        <HStack gap={'space-16'} justify={'space-between'} width={'100%'}>
          {!expandFeedback && consent === 'true' && (
            <Button size={'small'} onClick={() => setExpandFeedback((value) => !value)}>
              Gi tilbakemelding
            </Button>
          )}
          <Link
            onClick={() => {
              if (typeof window !== 'undefined') {
                logUmamiClickButton('Tilbake til gammel versjon', 'new-product-page-toggle', 'action')
                localStorage.setItem(localStorageProductPageBeta, 'false')
                setBetaEnabled('false')
              }
            }}
            style={{ marginLeft: 'auto' }}
          >
            Tilbake til gammel versjon
          </Link>
        </HStack>
      </VStack>
      {expandFeedback && (
        <Box>
          <div>
            {/* @ts-expect-error Ikke typet */}
            <skyra-survey slug="arbeids-og-velferdsetaten-nav/finnhjelpemiddel-ny-produktside"></skyra-survey>
          </div>
        </Box>
      )}
    </Box>
  )
}
