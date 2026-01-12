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
    <Box padding="space-16" className={styles.container} aria-live="polite">
      <span className={styles.content}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.message}>{message}</span>
      </span>
    </Box>
  )
}
