'use client'

import { Box } from '@navikt/ds-react'
import { ReactNode } from 'react'
import styles from './Toast.module.scss'

export interface ToastProps {
  message: ReactNode
  icon?: ReactNode
}

export const Toast = ({ message, icon }: ToastProps) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        maxWidth: 'min(90vw, 480px)',
      }}
      aria-live="polite"
    >
      <Box padding="space-16" className={styles.container}>
        <span className={styles.content}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <span className={styles.message}>{message}</span>
        </span>
      </Box>
    </div>
  )
}
