import { mapAgreement } from '@/utils/agreement-util'
import {
  fetchProductsWithVariants,
  getAgreement,
  getProductWithVariants,
  getProductsInPost,
  getSupplier,
} from '@/utils/api-util'
import { Product, mapProductFromSeriesId, mapProductsFromCollapse } from '@/utils/product-util'
import { mapSupplier } from '@/utils/supplier-util'

import AccessoryOrSparePartPage from './AccessoryOrSparePartPage'
import ProductPage from './ProductPage'
import './product-page.scss'
import { sortWithNullValuesAtEnd } from '@/utils/sort-util'

export default async function ProduktPage({ params: { id: seriesId } }: { params: { id: string } }) {
  // Bruk denne som product dersom man ønsker å se tilbehørsside/reservedelside og tilhørende produkter
  // const product = accessoriesMock[0]

  const product = mapProductFromSeriesId(await getProductWithVariants(seriesId))
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
  const matchingSeriesIds = product.attributes.compatibleWith?.length ? product.attributes.compatibleWith : null
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
