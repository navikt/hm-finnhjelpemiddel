'use client'
import { Box, Button, Popover, VStack } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import styles from './SkyraSurvey.module.scss'
import { XMarkIcon } from '@navikt/aksel-icons'

export const SkyraSurvey = ({ buttonText, skyraSlug }: { buttonText: string; skyraSlug: string }) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [openState, setOpenState] = useState<boolean>(false)

  return (
    <Box className={styles.container}>
      <Button
        ref={buttonRef}
        onClick={() => setOpenState((prev) => !prev)}
        aria-expanded={openState}
        variant="tertiary"
        className={styles.button}
      >
        {buttonText}
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
            <skyra-survey slug={skyraSlug} />
          </VStack>
        </Popover.Content>
      </Popover>
    </Box>
  )
}
