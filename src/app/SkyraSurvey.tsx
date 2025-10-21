'use client'
import { Box, Button, Popover, Show, VStack } from '@navikt/ds-react'
import { useEffect, useRef, useState } from 'react'
import styles from './SkyraSurvey.module.scss'
import { HeartFillIcon, XMarkIcon } from '@navikt/aksel-icons'

export const SkyraSurvey = ({ buttonText, skyraSlug }: { buttonText: string; skyraSlug: string }) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const skyraSurveyRef = useRef<HTMLElement>(null)
  const [openState, setOpenState] = useState<boolean>(false)

  useSkyra({
    skyraSurveyRef,
    openState,
    setOpenState,
    delayMs: 250,
  })

  return (
    <Box className={styles.container}>
      <Button
        ref={buttonRef}
        onClick={() => setOpenState((prev) => !prev)}
        aria-expanded={openState}
        variant="tertiary"
        className={styles.button}
      >
        <Show above={'sm'}>{buttonText}</Show>
        <Show below={'sm'} asChild>
          <HeartFillIcon aria-hidden fontSize={'24px'} style={{ display: 'block' }} />
        </Show>
      </Button>

      <Popover placement="bottom" open={openState} onClose={() => setOpenState(false)} anchorEl={buttonRef.current}>
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
  )
}

function useSkyra({
  skyraSurveyRef,
  openState,
  setOpenState,
  delayMs,
}: {
  skyraSurveyRef: React.RefObject<HTMLElement | null>
  openState: boolean
  setOpenState: (value: boolean) => void
  delayMs: number
}): void {
  const initialCheckDone = useRef<boolean>(false)

  useEffect(() => {
    if (!skyraSurveyRef.current || !openState) {
      initialCheckDone.current = false
      return
    }

    const checkShadowContent = (): boolean => {
      const element = skyraSurveyRef.current
      return !!(element && element.shadowRoot && element.shadowRoot.childElementCount > 0)
    }

    const initialCheckTimeout = setTimeout(() => {
      const hasShadowContent = checkShadowContent()

      if (!hasShadowContent && openState) {
        setOpenState(false)
      }

      initialCheckDone.current = true
    }, delayMs)

    const observer = new MutationObserver(() => {
      if (initialCheckDone.current && !checkShadowContent() && openState) {
        setOpenState(false)
        window.skyra?.reload?.()
      }
    })

    if (skyraSurveyRef.current) {
      observer.observe(skyraSurveyRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      })

      if (skyraSurveyRef.current.shadowRoot) {
        observer.observe(skyraSurveyRef.current.shadowRoot, {
          childList: true,
          subtree: true,
        })
      }
    }

    return () => {
      clearTimeout(initialCheckTimeout)
      observer.disconnect()
    }
  }, [openState, skyraSurveyRef, setOpenState, delayMs])
}
