import { Metadata } from 'next'
import { fetchProductsWithVariants } from '@/utils/api-util'
import { Product } from '@/utils/product-util'
import { Heading } from '@/components/aksel-client'
import { CompareTable } from '@/app/sammenlign/CompareTable'

export const metadata: Metadata = {
  title: 'Sammenligner',
  description: 'Sammenlign produkter',
}
type Props = {
  searchParams: Promise<{ [key: string]: string[] | string | undefined }>
}

export default async function Page(props: Props) {
  const ids = ((await props.searchParams)['id'] as string[]) ?? []

  const productsToCompareWithVariants: Product[] =
    (ids && (await fetchProductsWithVariants(Array.isArray(ids) ? ids : [ids])).products) ?? []

  const sortedProductsToCompare =
    productsToCompareWithVariants && sortProductsOnAgreementPostAndRank(productsToCompareWithVariants)

  return (
    <div className="main-wrapper--xlarge compare-page spacing-top--large spacing-bottom--xlarge">
      <Heading level="1" size="large" spacing>
        Sammenlign produkter
      </Heading>

      {<CompareTable productsToCompare={sortedProductsToCompare} />}
    </div>
  )
}

function sortProductsOnAgreementPostAndRank(products: Product[]): Product[] {
  return products.sort((a, b) => {
    if (a.agreements.length === 0 && b.agreements.length === 0) {
      return 0
    } else if (a.agreements.length === 0) {
      return 1 // Place products without agreements after products with agreements
    } else if (b.agreements.length === 0) {
      return -1 // Place products without agreements after products with agreements
    } else {
      // Both products have agreements, sort by postNumber, then rank
      const postNumberComparison = a.agreements[0].postNr - b.agreements[0].postNr
      if (postNumberComparison !== 0) {
        return postNumberComparison
      } else {
        return a.agreements[0].rank - b.agreements[0].rank
      }
    }
  })
}
