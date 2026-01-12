'use client'

import { JSX, useCallback, useState } from 'react'

export type ToastOptions = {
  autoHideMs?: number
}

export const useToast = (options?: ToastOptions) => {
  const { autoHideMs = 3000 } = options || {}
  const [message, setMessage] = useState<string | null>(null)
  const [icon, setIcon] = useState<JSX.Element | null>(null)

  const showToast = useCallback(
    (nextMessage: string, nextIcon: JSX.Element) => {
      setMessage(nextMessage)
      setIcon(nextIcon)
      if (autoHideMs > 0) {
        window.setTimeout(() => {
          setMessage((current) => (current === nextMessage ? null : current))
        }, autoHideMs)
      }
    },
    [autoHideMs]
  )

  const hideToast = useCallback(() => {
    setMessage(null)
    setIcon(null)
  }, [])

  return { message, icon, showToast, hideToast }
}
