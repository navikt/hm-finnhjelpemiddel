import { fetchProductsWithVariants, getProductWithVariants, getProductsInPost, getSupplier } from '@/utils/api-util'
// import { accessoriesMock } from '@/utils/mock-data'
import { Product, mapProductFromSeriesId, mapProductsFromCollapse } from '@/utils/product-util'
import { mapSupplier } from '@/utils/supplier-util'

import AccessoryOrSparePartPage from './AccessoryOrSparePartPage'
import ProductPage from './ProductPage'
import './product-page.scss'
import { accessoriesMock } from '@/utils/mock-data'
import { sortWithNullValuesAtEnd } from '@/utils/sort-util'

export interface ProductsOnPost {
  postTitle: string
  postNr: number
  products?: Product[]
}

import { Metadata } from 'next'

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = mapProductFromSeriesId(await getProductWithVariants(params.id))

  return {
    title: product.title,
    description: 'Produktside for ' + product.title,
  }
}

export default async function ProduktPage({ params }: Props) {
  console.log('ID\n', params.id)

  // Bruk denne som product dersom man ønsker å se tilbehørsside/reservedelside og tilhørende produkter
  // const product = accessoriesMock[0]

  const product = mapProductFromSeriesId(await getProductWithVariants(params.id))
  const supplier = mapSupplier((await getSupplier(product.supplierId))._source)

  const agreements = product.agreements?.filter((agreement) => new Date(agreement.expired) >= new Date())

  console.log('AGREEMENTS', agreements)

  const productsOnPosts: ProductsOnPost[] | undefined =
    agreements &&
    (await Promise.all(
      product.agreements
        ? product.agreements?.map(async (agreement) => {
            const productsOnPost = mapProductsFromCollapse(await getProductsInPost(agreement.id, agreement.postNr))
              .filter((postProduct) => postProduct.id !== product.id)
              .sort((productA, productB) => {
                const agreementA = productA.agreements
                  ?.filter((ag) => ag.postNr === agreement.postNr)
                  .map((agree) => agree.rank)
                const agreementB = productB.agreements
                  ?.filter((ag) => ag.postNr === agreement.postNr)
                  .map((agree) => agree.rank)
                return agreementA && agreementB ? sortWithNullValuesAtEnd(agreementA[0], agreementB[0]) : 0
              })
            return {
              postTitle: agreement.postTitle,
              postNr: agreement.postNr,
              products: productsOnPost,
            }
          })
        : []
    ))

  // const isAccessoryOrSparePart = false
  const isAccessoryOrSparePart = product.accessory || product.sparepart
  //TODO: Endre på product.attributes.matchingProducts når vi vet mer om hvordan vi skal knytte sammen product og tilbehør/reservedeler
  const matchingSeriesIds = product.attributes.matchingProducts?.length ? product.attributes.matchingProducts : null
  const matchingProducts = matchingSeriesIds ? (await fetchProductsWithVariants(matchingSeriesIds)).products : null

  //TODO: Lage fetchmetode som henter alle produkter som er tilbehør og reservedel. Dermed må de matches på serieID.
  //Forløpig: Sender inn en tom liste som fører til ingen visning. Bruk mock for å teste lokalt:

  // const accessories = accessoriesMock
  // const spareParts = sparePartsMock
  const accessories: Product[] = []
  const spareParts: Product[] = []

  return (
    <div className="main-wrapper">
      {isAccessoryOrSparePart ? (
        <AccessoryOrSparePartPage product={product} supplier={supplier} matchingProducts={matchingProducts} />
      ) : (
        <ProductPage
          product={product}
          supplier={supplier}
          productsOnPosts={productsOnPosts}
          accessories={accessories}
          spareParts={spareParts}
        />
      )}
    </div>
  )
}
