'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { NotFound } from '@/app/[...not-found]/NotFound'
import { logUmamiErrorOnUrl } from '@/utils/umami'

export default function Error({ error }: { error: Error & { digest?: string } }) {
  const path = usePathname()

  useEffect(() => {
    logUmamiErrorOnUrl(path)
  }, [error, path])

  return <NotFound />
}
