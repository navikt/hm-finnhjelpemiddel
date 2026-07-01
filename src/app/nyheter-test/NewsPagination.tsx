'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Pagination } from '@navikt/ds-react'

type Props = {
  currentPage: number,
  totalPages: number
}

export default function NewsPagination({ currentPage, totalPages }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

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
      prevNextTexts
    />
  )
}
