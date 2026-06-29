import { getNewsPaginated } from '@/app/nyheter-test/news-util'
import NewsGridPage from '@/app/nyheter-test/NewsGridPage'

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams
  const currentPage = Number(page ?? 1) - 1
  const { content, totalSize, pageable } = await getNewsPaginated(currentPage)
  const totalPages = Math.ceil(totalSize / pageable.size)

  return <NewsGridPage news={content} totalPages={totalPages} currentPage={currentPage + 1} />
}
