'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Pagination } from '@navikt/ds-react'
import React, { useEffect, useState } from 'react'

type Props = {
  currentPage: number,
  totalPages: number
}

export default function NewsPagination({ currentPage, totalPages }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 479px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
      <Pagination
        page={currentPage}
        count={totalPages}
        onPageChange={goToPage}
        srHeading={{ tag: 'h2', text: 'Sidenavigasjon' }}
        siblingCount={0}
        boundaryCount={1}
        size={isMobile ? 'small' : 'medium'}
      />
  )
}
