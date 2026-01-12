'use client'

import { Box } from '@navikt/ds-react'
import { ReactNode, useEffect, useRef, useState } from 'react'
import styles from './Toast.module.scss'
import { CSSTransition } from 'react-transition-group'

export interface ToastProps {
  message: ReactNode
  icon?: ReactNode
}

const isMessageVisible = (message: ReactNode) =>
  message !== null && message !== undefined && message !== ''

export const Toast = ({ message, icon }: ToastProps) => {
  const ref = useRef<HTMLDivElement | null>(null)

  const [displayMessage, setDisplayMessage] = useState<ReactNode>(message)

  useEffect(() => {
    if (isMessageVisible(message)) {
      setDisplayMessage(message)
    }
  }, [message])

  const isVisible = isMessageVisible(message)

  return (
    <CSSTransition
      in={isVisible}
      nodeRef={ref}
      timeout={1500}
      unmountOnExit
      classNames={{
        enter: styles.fadeEnter,
        enterActive: styles.fadeEnterActive,
        exit: styles.fadeExit,
        exitActive: styles.fadeExitActive,
      }}
    >
      <Box ref={ref} padding="space-16" className={styles.container} aria-live="polite">
        <span className={styles.content}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <span className={styles.message}>{displayMessage}</span>
        </span>
      </Box>
    </CSSTransition>
  )
}
