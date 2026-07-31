'use client'

import { useState } from 'react'
import { Box, HStack, Link, VStack } from '@navikt/ds-react'
import { localStorageProductPageBeta } from '@/app/produkt-test/[id]/ProductTestPage'

interface FeedbackBlockProps {
  setBetaEnabled: (value: string) => void
}

export const FeedbackBlock = ({ setBetaEnabled }: FeedbackBlockProps) => {
  const [expandFeedback, setExpandFeedback] = useState(false)

  return (
    <Box
      as={VStack}
      gap={'space-24'}
      paddingBlock={'space-12'}
      paddingInline={'space-24'}
      background={'warning-soft'}
      width={{ xs: '100%', sm: '500px' }}
      style={{ alignSelf: 'center' }}
    >
      <HStack gap={'space-24'} justify={'space-between'}>
        <Link onClick={() => setExpandFeedback((value) => !value)}>Gi tilbakemelding</Link>
        <Link
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.setItem(localStorageProductPageBeta, 'false')
              setBetaEnabled('false')
            }
          }}
        >
          Tilbake til gammel versjon
        </Link>
      </HStack>
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
