import ComparePage from './ComparePage'
import { Metadata } from 'next'
import { fetchProductsWithVariants } from '@/utils/api-util'

export const metadata: Metadata = {
  title: 'Sammenligner',
  description: 'Sammenlign produkter',
}
type Props = {
  searchParams: Promise<{ [key: string]: string[] | string | undefined }>
}

export default async function Page(props: Props) {
  const ids = ((await props.searchParams)['id'] as string[]) ?? []

  const products = (ids && (await fetchProductsWithVariants(ids)).products) ?? []

  console.log(products.map((p) => p.id))

  return <ComparePage products={products} />
}
