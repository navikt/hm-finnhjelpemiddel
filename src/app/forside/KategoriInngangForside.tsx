'use client'

import { BodyLong, Box, Button, Heading, HGrid, Popover, Show, VStack } from '@navikt/ds-react'
import { CategoryCard } from '@/app/kategori/CategoryCard'
import { BevegelseIkon } from '@/app/kategori/ikoner/BevegelseIkon'
import { useRef, useState } from 'react'
import styles from './SkyraSurveyKategori.module.scss'
import { ChatIcon, HeartFillIcon, XMarkIcon } from '@navikt/aksel-icons'
import { useSkyra } from '@/app/SkyraSurvey'
import { getCookie } from '@/app/layoutProvider'

export const KategoriInngangForside = () => {
  const [consent] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return getCookie('finnhjelpemiddel-consent')
    } else {
      return 'pending'
    }
  })

  return (
    <VStack gap={'4'} paddingInline={{ lg: '6' }}>
      <Heading level={'2'} size={'large'}>
        Kategori-inngang (beta)
      </Heading>
      <HGrid gap={'4'} columns={{ xs: 1, md: 2 }} paddingBlock={'2 0'} maxWidth={'700px'}>
        <CategoryCard title={'Bevegelse'} link={'/kategori/Bevegelse'} icon={BevegelseIkon()} />
      </HGrid>
      {consent === 'true' && <SkyraSurveyKategori buttonText={'Gi oss tilbakemelding'} />}
    </VStack>
  )
}

const SkyraSurveyKategori = ({ buttonText }: { buttonText: string }) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const skyraSurveyRef = useRef<HTMLElement>(null)
  const [openState, setOpenState] = useState<boolean>(false)

  const skyraSlug = 'arbeids-og-velferdsetaten-nav/finnhjelpemiddel-kategori-innganger'

  useSkyra({
    skyraSurveyRef,
    openState,
    setOpenState,
    delayMs: 250,
  })

  return (
    <Show above={'sm'}>
      <Box className={styles.container} paddingBlock={'4 0'}>
        <Button
          ref={buttonRef}
          onClick={() => setOpenState((prev) => !prev)}
          aria-expanded={openState}
          variant="secondary"
          icon={<ChatIcon aria-hidden />}
          style={{
            boxShadow:
              'inset 0 0 0 1px var(--ac-button-secondary-border, var(--__ac-button-secondary-border, var(--a-border-action)))',
          }}
        >
          <Show above={'sm'}>{buttonText}</Show>
          <Show below={'sm'} asChild>
            <HeartFillIcon aria-hidden fontSize={'24px'} style={{ display: 'block' }} />
          </Show>
        </Button>

        <Popover placement="top" open={openState} onClose={() => setOpenState(false)} anchorEl={buttonRef.current}>
          <Popover.Content style={{ width: '360px', paddingTop: '10px' }}>
            <VStack gap={'0'}>
              <Button
                className={styles.closeButton}
                variant={'tertiary'}
                size={'xsmall'}
                icon={<XMarkIcon aria-hidden />}
                title={'Lukk'}
                onClick={() => setOpenState(false)}
              />
              {/* @ts-expect-error Ikke typet */}
              <skyra-survey ref={skyraSurveyRef} slug={skyraSlug} />
            </VStack>
          </Popover.Content>
        </Popover>
      </Box>
    </Show>
  )
}
