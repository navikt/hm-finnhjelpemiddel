import useSWRImmutable from 'swr/immutable'
import { getAlternativeProductsInventory, getProductFromHmsArtNr } from '@/utils/api-util'
import useSWR from 'swr'
import { Product } from '@/utils/product-util'
import { Box, HGrid, HStack, Label, Loader, Tag } from '@navikt/ds-react'
import { Heading } from '@/components/aksel-client'
import React from 'react'
import styles from '@/app/alternativprodukter/AlternativeProducts.module.scss'
import { AlternativeProduct, AlternativeProductResponse, WarehouseStock } from '@/app/alternativprodukter/page'
import { AlternativeProductCard } from '@/app/alternativprodukter/AlternativeProductCard'

export const AlternativeProductList = ({
  hmsNumber,
  currentWarehouse,
}: {
  hmsNumber: string
  currentWarehouse?: string | undefined
}) => {
  const { data: alternativeResponse } = useSWRImmutable<AlternativeProductResponse>(`/alternativ/${hmsNumber}`, () =>
    getAlternativeProductsInventory(hmsNumber)
  )
  const alternatives = alternativeResponse?.alternatives
  const hmsArtNrs = alternatives?.map((alternative) => alternative.hmsArtNr) ?? []

  const { data: products, isLoading } = useSWR<Product[]>(
    alternativeResponse ? `alternatives-${hmsNumber}` : null,
    () => getProductFromHmsArtNr(hmsArtNrs)
  )

  const { data: originalProductResponse, isLoading: isLoadingOriginal } = useSWR<Product[]>(
    alternativeResponse ? hmsNumber : null,
    () => getProductFromHmsArtNr([hmsNumber])
  )

  if (isLoading || isLoadingOriginal || !products || !originalProductResponse) {
    return <Loader />
  }

  if (!alternatives || alternatives.length == 0) {
    return <>{hmsNumber} har ingen kjente alternativer for gjenbruk</>
  }

  const originalProduct = mapToAlternativeProduct(
    currentWarehouse,
    originalProductResponse[0],
    alternativeResponse.original.warehouseStock
  )

  const alternativeProducts: AlternativeProduct[] = products.map((product) => {
    const stocks = alternatives.find((alt) => alt.hmsArtNr === product.variants[0].hmsArtNr)?.warehouseStock!
    return mapToAlternativeProduct(currentWarehouse, product, stocks)
  })

  sortAlternativeProducts(alternativeProducts)

  return (
    <>
      <div>
        <Heading size="medium" spacing>
          Treff på HMS {hmsNumber}:<HGrid gap={'4'} columns={{ sm: 1, md: 1 }}></HGrid>
        </Heading>
        <AlternativeProductCard alternativeProduct={originalProduct} currentWarehouse={currentWarehouse} />
      </div>
      <div>
        <Heading size="medium" spacing>
          Alternative produkter
        </Heading>
        <HGrid gap={'4'} columns={{ sm: 1, md: 1 }}>
          {alternativeProducts
            .filter((alternative) => alternative.isInStock)
            .map((alternative) => {
              return (
                <AlternativeProductCard
                  alternativeProduct={alternative}
                  currentWarehouse={currentWarehouse}
                  key={alternative.product.variants[0]!.id}
                />
              )
            })}
        </HGrid>
      </div>
    </>
  )
}

export const getNumberInStock = (warehouseStock: WarehouseStock) => {
  return Math.max(warehouseStock.tilgjengelig - warehouseStock.behovsmeldt, 0)
}

const mapToAlternativeProduct = (
  currentWarehouse: string | undefined,
  product: Product,
  stocks: WarehouseStock[]
): AlternativeProduct => {
  return {
    product: product,
    stocks: stocks,
    currentWarehouseStock: currentWarehouse
      ? stocks.find((stockLocation) => stockLocation.organisasjons_navn.includes(currentWarehouse))
      : undefined,
    isInStock: !!stocks.find((stock) => getNumberInStock(stock) > 0),
  }
}

const sortAlternativeProducts = (alternativeProducts: AlternativeProduct[]) => {
  alternativeProducts.sort((a, b) => {
    if (a.product.variants[0].agreements.length === 0 && b.product.variants[0].agreements.length === 0) {
      return (
        (b.currentWarehouseStock ? getNumberInStock(b.currentWarehouseStock) : 0) -
        (a.currentWarehouseStock ? getNumberInStock(a.currentWarehouseStock) : 0)
      )
    }
    if (a.product.variants[0].agreements.length === 0) {
      return 1
    }
    if (b.product.variants[0].agreements.length === 0) {
      return -1
    }
    return (
      a.product.variants[0].agreements[0].rank - b.product.variants[0].agreements[0].rank ||
      (b.currentWarehouseStock ? getNumberInStock(b.currentWarehouseStock) : 0) -
        (a.currentWarehouseStock ? getNumberInStock(a.currentWarehouseStock) : 0)
    )
  })
}
