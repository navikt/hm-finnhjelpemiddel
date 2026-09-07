import NewsGridPage from '@/app/aktuelt/NewsGridPage'
import { NewsTag, PublishingState, getAllTags, getNewsPaginated } from '@/app/aktuelt/news-util'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aktuelt',
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string | string[]; search?: string }>
}) {
  const { page, tag, search } = await searchParams
  const currentPage = Number(page ?? 1) - 1
  const selectedTags = Array.isArray(tag) ? tag : tag ? [tag] : []
  const [{ content, totalSize, pageable }, allTags] = await Promise.all([
    getNewsPaginated(currentPage, 9, selectedTags, search ?? '', [
      PublishingState.ACTIVE,
      PublishingState.EXPIRED,
    ]).catch(() => ({ content: [], totalSize: 0, pageable: { number: 0, size: 9 } })),
    getAllTags().catch(() => [] as NewsTag[]),
  ])
  const totalPages = Math.ceil(totalSize / pageable.size)

  return <NewsGridPage news={content} totalPages={totalPages} currentPage={currentPage + 1} allTags={allTags} />
}
