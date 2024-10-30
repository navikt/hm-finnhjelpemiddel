import { HGrid, Loader } from '@navikt/ds-react'
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
  currentWarehouse,
}: {
  hmsNumber: string
  currentWarehouse?: string | undefined
}) => {
  const {
    data: original,
    isLoading: isLoadingOrig,
    error: errorOrig,
  } = useSWRImmutable<AlternativeProduct>(hmsNumber, getOriginalProductFromHmsArtNr)

  const {
    data: alts,
    isLoading: isLoadingAlts,
    error: errorAlts,
  } = useSWRImmutable<AlternativeProduct[]>(`alts-${hmsNumber}`, () => getAlternativeProductsFromHmsArtNr(hmsNumber))

  if (errorAlts || errorOrig) {
    return <>En feil har skjedd ved henting av data</>
  }

  if (isLoadingAlts || isLoadingOrig) {
    return <Loader />
  }

  if (!original) {
    return <>Finner ikke produkt {hmsNumber}</>
  }

  if (!alts || alts.length == 0) {
    return <>{hmsNumber} har ingen kjente alternativer for gjenbruk</>
  }

  sortAlternativeProducts(alts, currentWarehouse)

  return (
    <>
      <div>
        <Heading size="medium" spacing>
          Treff på HMS {hmsNumber}:<HGrid gap={'4'} columns={{ sm: 1, md: 1 }}></HGrid>
        </Heading>
        <AlternativeProductCard
          alternativeProduct={original}
          currentWarehouse={currentWarehouse}
          currentWarehouseStock={
            currentWarehouse ? getSelectedWarehouseStock(currentWarehouse, original.warehouseStock) : undefined
          }
        />
      </div>
      <div>
        <Heading size="medium" spacing>
          Alternative produkter
        </Heading>
        <HGrid gap={'4'} columns={{ sm: 1, md: 1 }}>
          {alts.map((alternative) => {
            return (
              <AlternativeProductCard
                alternativeProduct={alternative}
                currentWarehouse={currentWarehouse}
                currentWarehouseStock={
                  currentWarehouse ? getSelectedWarehouseStock(currentWarehouse, alternative.warehouseStock) : undefined
                }
                key={alternative.id}
              />
            )
          })}
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

const sortAlternativeProducts = (alternativeProducts: AlternativeProduct[], currentWarehouse?: string | undefined) => {
  alternativeProducts.sort((a, b) => {
    const stockSort = currentWarehouse
      ? (getSelectedWarehouseStock(currentWarehouse, b.warehouseStock)?.actualAvailable ?? 0) -
        (getSelectedWarehouseStock(currentWarehouse, a.warehouseStock)?.actualAvailable ?? 0)
      : 0

    return a.highestRank - b.highestRank || stockSort
  })
}
