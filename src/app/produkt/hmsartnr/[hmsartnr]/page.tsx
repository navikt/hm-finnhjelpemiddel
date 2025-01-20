import {
  fetchProductsWithVariants,
  getProductByHmsartnrWithVariants,
  getProductsInPost,
  getSupplier
} from '@/utils/api-util'
import { mapProductFromSeriesId, mapProductsFromCollapse, Product } from '@/utils/product-util'
import { mapSupplier } from '@/utils/supplier-util'

import { sortWithNullValuesAtEnd } from '@/utils/sort-util'
import { Metadata } from 'next'
import '../../product-page.scss'
import AccessoryOrSparePartPage from "@/app/produkt/AccessoryOrSparePartPage";
import ProductPage from "@/app/produkt/ProductPage";


export interface ProductsOnPost {
  agreementId: string
  agreementTitle: string
  postTitle: string
  postNr: number
  products?: Product[]
}

type Props = {
  params: Promise<{ hmsartnr: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const product = mapProductFromSeriesId(await getProductByHmsartnrWithVariants(params.hmsartnr))

  return {
    title: product.title,
    description: 'Produktside for ' + product.title,
  }
}

export default async function ProduktPage(props: Props) {
  const params = await props.params;

  const product = mapProductFromSeriesId(await getProductByHmsartnrWithVariants(params.hmsartnr))
  const supplier = mapSupplier((await getSupplier(product.supplierId))._source)

  const agreements = product.agreements?.filter((agreement) => new Date(agreement.expired) >= new Date())

  //NB! Et produkt kan være på flere avtaler og på flere delkontrakter med ulik rangering for hver avtale.
  const productsOnPosts: ProductsOnPost[] | undefined =
    agreements &&
    (await Promise.all(
      (product.agreements || []).map(async (agreement) => {
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
    ))

  const isAccessoryOrSparePart = product.accessory || product.sparepart
  const matchingSeriesIds = product.attributes.compatibleWith

  const matchingProducts = (matchingSeriesIds && (await fetchProductsWithVariants(matchingSeriesIds)).products) || []

  const accessories = (!isAccessoryOrSparePart && matchingProducts?.filter((product) => product.accessory)) || []
  const spareParts = (!isAccessoryOrSparePart && matchingProducts?.filter((product) => product.sparepart)) || []

  return (
    <div className="main-wrapper--large product-page">
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
