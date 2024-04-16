import { fetchProductsWithVariants, getProductWithVariants, getProductsInPost, getSupplier } from '@/utils/api-util'
// import { accessoriesMock } from '@/utils/mock-data'
import { Product, mapProductFromSeriesId, mapProductsFromCollapse } from '@/utils/product-util'
import { mapSupplier } from '@/utils/supplier-util'

import { sortWithNullValuesAtEnd } from '@/utils/sort-util'
import { Metadata } from 'next'
import AccessoryOrSparePartPage from './AccessoryOrSparePartPage'
import ProductPage from './ProductPage'
import './product-page.scss'

export interface ProductsOnPost {
  agreementId: string
  agreementTitle: string
  postTitle: string
  postNr: number
  products?: Product[]
}

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
  // Bruk denne som product dersom man ønsker å se tilbehørsside/reservedelside og tilhørende produkter
  // const product = accessoriesMock[0]

  const product = mapProductFromSeriesId(await getProductWithVariants(params.id))
  const supplier = mapSupplier((await getSupplier(product.supplierId))._source)

  const agreements = product.agreements?.filter((agreement) => new Date(agreement.expired) >= new Date())

  //NB! Et produkt kan være på flere avtaler og på flere delkontrakter med ulik rangering for hver avtale.
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
              agreementId: agreement.id,
              agreementTitle: agreement.title,
              postTitle: agreement.postTitle,
              postNr: agreement.postNr,
              products: productsOnPost,
            }
          })
        : []
    ))

  const isAccessoryOrSparePart = product.accessory || product.sparepart
  const matchingSeriesIds = product.attributes.compatibleWith

  const matchingProducts = (matchingSeriesIds && (await fetchProductsWithVariants(matchingSeriesIds)).products) || []

  const accessories = (!isAccessoryOrSparePart && matchingProducts?.filter((product) => product.accessory)) || []
  // Kommenter ut den over og bruk den under for å se tilbehør på produktside (når man bruker mock)
  // const accessories = (!isAccessoryOrSparePart && matchingProducts) || []
  const spareParts = (!isAccessoryOrSparePart && matchingProducts?.filter((product) => product.sparepart)) || []

  return (
    <div className="main-wrapper--large product-info">
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
