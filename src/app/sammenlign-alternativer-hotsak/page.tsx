'use client'

import { Suspense } from 'react'
import CompareAlternativesHotsakPage from "@/app/sammenlign-alternativer-hotsak/CompareAlternativesHotsakPage";
import { useSearchParams } from "next/navigation";


export default function Page() {
  const searchParams = useSearchParams()
  const ids = searchParams.getAll('ids')

  return (
    <Suspense>
      <CompareAlternativesHotsakPage productIdsToCompare={ids} />
    </Suspense>
  )
}
