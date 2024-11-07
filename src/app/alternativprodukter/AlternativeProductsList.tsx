import { BodyShort, HGrid, Loader } from '@navikt/ds-react'
import { Heading } from '@/components/aksel-client'
import React from 'react'
import { AlternativeProductCard } from '@/app/alternativprodukter/AlternativeProductCard'
import {
  AlternativeProduct,
  getAlternativeProductsFromHmsArtNr,
  getOriginalProductFromHmsArtNr,
  WarehouseStock,
} from '@/app/alternativprodukter/alternative-util'
import useSWRImmutable from 'swr/immutable'

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

  if (errorAlternatives || errorOrig) {
    return <>En feil har skjedd ved henting av data</>
  }

  if (isLoadingAlternatives || isLoadingOrig) {
    return <Loader />
  }

  if (!original) {
    return <>Finner ikke produkt {hmsNumber}</>
  }

  if (alternatives) {
    sortAlternativeProducts(alternatives, selectedWarehouse)
  }

  return (
    <>
      <div>
        <Heading size="medium" spacing>
          Treff på HMS {hmsNumber}:<HGrid gap={'4'} columns={{ sm: 1, md: 1 }}></HGrid>
        </Heading>
        <AlternativeProductCard
          alternativeProduct={original}
          selectedWarehouseStock={
            selectedWarehouse ? getSelectedWarehouseStock(selectedWarehouse, original.warehouseStock) : undefined
          }
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

    if (stockA > 0 && stockB > 0) {
      return a.highestRank - b.highestRank || selectedWarehouseStockSort
    }

    if (stockA > 0 || stockB > 0) {
      return selectedWarehouseStockSort
    }

    return a.highestRank - b.highestRank
  })
}
