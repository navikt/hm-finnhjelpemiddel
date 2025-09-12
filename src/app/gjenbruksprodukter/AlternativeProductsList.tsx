import { BodyShort, HGrid, Loader } from '@navikt/ds-react'
import { Heading } from '@/components/aksel-client'
import React, { useState } from 'react'
import { AlternativeProductCard } from '@/app/gjenbruksprodukter/AlternativeProductCard'
import {
  AlternativeProduct,
  getAlternativeProductsFromHmsArtNr,
  getOriginalProductFromHmsArtNr,
  testAlt,
  WarehouseStock,
} from '@/app/gjenbruksprodukter/alternative-util'
import useSWRImmutable from 'swr/immutable'
import CompareAlternativeProductsMenu from '@/components/layout/CompareAlternativeProductsMenu'
import {
  CompareAlternativesMenuState,
  useHydratedAlternativeProductsCompareStore,
} from '@/utils/compare-alternatives-state-util'
import useSWR from 'swr'
import { Product } from '@/utils/product-util'
import { getProductFromHmsArtNrs } from '@/utils/api-util'

export const AlternativeProductList = ({
  hmsNumber,
  selectedWarehouse,
}: {
  hmsNumber: string
  selectedWarehouse?: string | undefined
}) => {
  const {
    data: original,
    isLoading: isLoadingOrig,
    error: errorOrig,
  } = useSWRImmutable<AlternativeProduct>(`orig-${hmsNumber}`, () => getOriginalProductFromHmsArtNr(hmsNumber))

  const {
    data: alternatives,
    isLoading: isLoadingAlternatives,
    error: errorAlternatives,
  } = useSWRImmutable<AlternativeProduct[]>(`alts-${hmsNumber}`, () => getAlternativeProductsFromHmsArtNr(hmsNumber))

  const { data: alternativeResponse, error: alternativeError } = useSWRImmutable(`asdasd-${hmsNumber}`, () =>
    testAlt(hmsNumber)
  )
  const alternativeStocks = alternativeResponse?.alternatives
  const hmsArtNrs = alternativeStocks?.map((alternativeStock) => alternativeStock.hmsArtNr) ?? []

  const {
    data: products,
    isLoading,
    error: productsError,
  } = useSWR<Product[]>(alternativeResponse ? `alternatives-${hmsNumber}` : null, () =>
    getProductFromHmsArtNrs(hmsArtNrs)
  )

  const {
    data: originalProductResponse,
    isLoading: isLoadingOriginal,
    error: originalProductError,
  } = useSWR<Product[]>(alternativeResponse ? hmsNumber : null, () => getProductFromHmsArtNrs([hmsNumber]))

  const { setCompareAlternativesMenuState } = useHydratedAlternativeProductsCompareStore()
  const [firstCompareClick, setFirstCompareClick] = useState(true)

  if (alternatives) {
    sortAlternativeProducts(alternatives, selectedWarehouse)
  }

  if (errorAlternatives || errorOrig || alternativeError) {
    return <>En feil har skjedd ved henting av data</>
  }

  if (isLoadingAlternatives || isLoadingOrig) {
    return <Loader />
  }

  if (!original) {
    return <>Finner ikke produkt {hmsNumber}</>
  }

  const handleCompareClick = () => {
    if (firstCompareClick) {
      setCompareAlternativesMenuState(CompareAlternativesMenuState.Open)
    }
    setFirstCompareClick(false)
  }

  return (
    <>
      <CompareAlternativeProductsMenu />
      <div>
        <Heading size="medium" spacing>
          Treff på HMS {hmsNumber}:<HGrid gap={'4'} columns={{ sm: 1, md: 1 }}></HGrid>
        </Heading>
        <AlternativeProductCard
          alternativeProduct={original}
          selectedWarehouseStock={
            selectedWarehouse ? getSelectedWarehouseStock(selectedWarehouse, original.warehouseStock) : undefined
          }
          handleCompareClick={handleCompareClick}
        />
      </div>
      <div>
        <Heading size="medium" spacing>
          Alternative produkter
        </Heading>
        <HGrid gap={'4'} columns={{ sm: 1, md: 1 }}>
          {alternatives && alternatives.length > 0 ? (
            alternatives?.map((alternative) => {
              return (
                <AlternativeProductCard
                  alternativeProduct={alternative}
                  selectedWarehouseStock={
                    selectedWarehouse
                      ? getSelectedWarehouseStock(selectedWarehouse, alternative.warehouseStock)
                      : undefined
                  }
                  key={alternative.id}
                  handleCompareClick={handleCompareClick}
                />
              )
            })
          ) : (
            <BodyShort>Ingen kjente alternativer for produktet på lager</BodyShort>
          )}
        </HGrid>
      </div>
    </>
  )
}

const getSelectedWarehouseStock = (selectedWarehouse: string, warehouseStocks: WarehouseStock[]): WarehouseStock => {
  const stock = warehouseStocks.find((stockLocation) => stockLocation.location.includes(selectedWarehouse))
  if (!stock) {
    throw new Error(`Finner ikke valgt lager: ${selectedWarehouse}`)
  }
  return stock
}

const sortAlternativeProducts = (alternativeProducts: AlternativeProduct[], selectedWarehouse?: string | undefined) => {
  alternativeProducts.sort((a, b) => {
    const selectedWarehouseStockSort = selectedWarehouse
      ? (getSelectedWarehouseStock(selectedWarehouse, b.warehouseStock)?.actualAvailable ?? 0) -
        (getSelectedWarehouseStock(selectedWarehouse, a.warehouseStock)?.actualAvailable ?? 0)
      : 0

    const stockA = selectedWarehouse
      ? (getSelectedWarehouseStock(selectedWarehouse, a.warehouseStock)?.actualAvailable ?? 0)
      : 0
    const stockB = selectedWarehouse
      ? (getSelectedWarehouseStock(selectedWarehouse, b.warehouseStock)?.actualAvailable ?? 0)
      : 0

    if (a.inStockAnyWarehouse && !b.inStockAnyWarehouse) {
      return -1
    }
    if (!a.inStockAnyWarehouse && b.inStockAnyWarehouse) {
      return 1
    }

    if (stockA > 0 && stockB > 0) {
      return a.highestRank - b.highestRank || selectedWarehouseStockSort
    }

    if (stockA > 0 || stockB > 0) {
      return selectedWarehouseStockSort
    }

    return a.highestRank - b.highestRank
  })
}
