'use client'

import { useRouter } from 'next/navigation'
import { Pagination } from '@navikt/ds-react'

type Props = {
  currentPage: number,
  totalPages: number
}

export default function NewsPagination({ currentPage, totalPages}: Props) {
  const router = useRouter()
  return (
    <Pagination
      page={currentPage}
      count={totalPages}
      onPageChange={(page) => router.push(`?page=${page}`)}
      srHeading={{ tag: 'h2', text: 'Sidenavigasjon' }}
      prevNextTexts
    />
  )
}
