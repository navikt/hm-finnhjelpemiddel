import { mapAgreement } from '@/utils/agreement-util'
import {
  fetchProductsWithVariants,
  getAgreement,
  getProductWithVariants,
  getProductsInPost,
  getSupplier,
} from '@/utils/api-util'
// import { accessoriesMock } from '@/utils/mock-data'
import { Product, mapProductFromSeriesId, mapProductsFromCollapse } from '@/utils/product-util'
import { mapSupplier } from '@/utils/supplier-util'

import AccessoryOrSparePartPage from './AccessoryOrSparePartPage'
import ProductPage from './ProductPage'
import './product-page.scss'
import { sortWithNullValuesAtEnd } from '@/utils/sort-util'

import { Metadata } from 'next'

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = mapProductFromSeriesId(await getProductWithVariants(params.id))

  return {
    title: product.title,
    description: 'Produktside for ' + product.title,
    icons: [{ rel: 'icon', type: 'image/x-icon', url: 'favicon.ico', sizes: 'any' }],
  }
}

export default async function ProduktPage({ params }: Props) {
  // Bruk denne som product dersom man ønsker å se tilbehørsside/reservedelside og tilhørende produkter
  // const product = accessoriesMock[0]

  const product = mapProductFromSeriesId(await getProductWithVariants(params.id))
  const supplier = mapSupplier((await getSupplier(product.supplierId))._source)

  const agreement =
    product.applicableAgreementInfo && mapAgreement((await getAgreement(product.applicableAgreementInfo.id))._source)

  const productsOnPost = product.applicableAgreementInfo?.postIdentifier
    ? mapProductsFromCollapse(await getProductsInPost(product.applicableAgreementInfo?.postIdentifier))
        .filter((postProduct) => postProduct.id !== product.id)
        .sort((productA, productB) => {
          return sortWithNullValuesAtEnd(productA.applicableAgreementInfo?.rank, productB.applicableAgreementInfo?.rank)
        })
    : null

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
        <AccessoryOrSparePartPage
          product={product}
          agreement={agreement}
          supplier={supplier}
          matchingProducts={matchingProducts}
        />
      ) : (
        <ProductPage
          product={product}
          agreement={agreement}
          supplier={supplier}
          productsOnPost={productsOnPost}
          accessories={accessories}
          spareParts={spareParts}
        />
      )}
    </div>
  )
}
