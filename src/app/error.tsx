'use client'

import { logErrorOnUrl } from '@/utils/amplitude'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { NotFound } from '@/app/[...not-found]/NotFound'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const path = usePathname()

  useEffect(() => {
    logErrorOnUrl(path)
  }, [error, path])

  return <NotFound />
}
