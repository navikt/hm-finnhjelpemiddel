import { mapAgreement } from '@/utils/agreement-util'
import {
  getAgreement,
  getProductWithVariants,
  getProductsInPost,
  getProductsWithVariants,
  getSupplier,
} from '@/utils/api-util'
import {
  Product,
  mapProductFromSeriesId,
  mapProductsFromAggregation,
  mapProductsFromCollapse,
} from '@/utils/product-util'
import { mapSupplier } from '@/utils/supplier-util'

import AccessoryOrSparePartPage from './AccessoryOrSparePartPage'
import ProductPage from './ProductPage'
import './product-page.scss'

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
        .sort((productA, productB) =>
          productA.applicableAgreementInfo && productB.applicableAgreementInfo
            ? productA.applicableAgreementInfo?.rank - productB.applicableAgreementInfo?.rank
            : -1
        )
    : null

  const isAccessoryOrSparePart = product.accessory || product.sparepart
  //TODO: Endre på product.attributes.matchingProducts når vi vet mer om hvordan vi skal knytte sammen product og tilbehør/reservedeler
  const matchingSeriesIds = product.attributes.matchingProducts?.length ? product.attributes.matchingProducts : null
  const url = process.env.HM_SEARCH_URL + '/products/_search'
  const matchingProducts = matchingSeriesIds
    ? mapProductsFromAggregation(await getProductsWithVariants(matchingSeriesIds))
    : null

  //TODO: Lage fetchmetode som henter alle produkter som er tilbehør og reservedel. Dermed må de matches på serieID.
  //Forløpig: Sender inn en tom liste som fører til ingen visning. Bruk mock for å teste lokalt:

  // const accessories = accessoriesMock
  // const spareParts = sparePartsMock
  const accessories: Product[] = []
  const spareParts: Product[] = []

  return (
    <>
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
    </>
  )
}
