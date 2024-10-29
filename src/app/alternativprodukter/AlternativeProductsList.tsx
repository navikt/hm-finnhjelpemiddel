import useSWR from 'swr'
import { HGrid, Loader } from '@navikt/ds-react'
import { Heading } from '@/components/aksel-client'
import React from 'react'
import { AlternativeProductCard } from '@/app/alternativprodukter/AlternativeProductCard'
import {
  AlternativeProduct,
  getAlternativeProductFromHmsArtNr,
  WarehouseStock,
} from '@/app/alternativprodukter/alternative-util'

export const AlternativeProductList = ({
  hmsNumber,
  currentWarehouse,
}: {
  hmsNumber: string
  currentWarehouse?: string | undefined
}) => {
  const {
    data: alts,
    isLoading: isLoadingAlts,
    error: errorAlts,
  } = useSWR<AlternativeProduct[]>(`alts-${hmsNumber}`, () => getAlternativeProductFromHmsArtNr(hmsNumber))

  console.log(alts)

  if (errorAlts) {
    return <>En feil har skjedd ved henting av data</>
  }

  if (isLoadingAlts) {
    return <Loader />
  }

  if (!alts || alts.length == 0) {
    return <>{hmsNumber} har ingen kjente alternativer for gjenbruk</>
  }

  sortAlternativeProducts(alts, currentWarehouse)

  const originalProduct = alts.find((alt) => alt.hmsArtNr === hmsNumber)!

  return (
    <>
      <div>
        <Heading size="medium" spacing>
          Treff på HMS {hmsNumber}:<HGrid gap={'4'} columns={{ sm: 1, md: 1 }}></HGrid>
        </Heading>
        <AlternativeProductCard
          alternativeProduct={originalProduct}
          currentWarehouse={currentWarehouse}
          currentWarehouseStock={getWarehouseStock(currentWarehouse, originalProduct.warehouseStock)}
        />
      </div>
      <div>
        <Heading size="medium" spacing>
          Alternative produkter
        </Heading>
        <HGrid gap={'4'} columns={{ sm: 1, md: 1 }}>
          {alts
            .filter((alternative) => alternative.hmsArtNr != hmsNumber)
            .map((alternative) => {
              return (
                <AlternativeProductCard
                  alternativeProduct={alternative}
                  currentWarehouse={currentWarehouse}
                  currentWarehouseStock={getWarehouseStock(currentWarehouse, alternative.warehouseStock)}
                  key={alternative.id}
                />
              )
            })}
        </HGrid>
      </div>
    </>
  )
}

export const getNumberInStock = (warehouseStock: WarehouseStock) => {
  return Math.max(warehouseStock.available - warehouseStock.needNotified, 0)
}

const getWarehouseStock = (
  selectedWarehouse: string | undefined,
  warehouseStocks: WarehouseStock[]
): WarehouseStock | undefined => {
  return selectedWarehouse
    ? warehouseStocks.find((stockLocation) => stockLocation.location.includes(selectedWarehouse))
    : undefined
}

const sortAlternativeProducts = (alternativeProducts: AlternativeProduct[], currentWarehouse?: string | undefined) => {
  alternativeProducts.sort((a, b) => {
    const aStock = getWarehouseStock(currentWarehouse, a.warehouseStock)
    const bStock = getWarehouseStock(currentWarehouse, b.warehouseStock)

    if (a.highestRank === 0 && b.highestRank === 0) {
      return (bStock ? getNumberInStock(bStock) : 0) - (aStock ? getNumberInStock(aStock) : 0)
    }
    if (a.highestRank === 0) {
      return 1
    }
    if (b.highestRank === 0) {
      return -1
    }
    return (
      a.highestRank - b.highestRank || (bStock ? getNumberInStock(bStock) : 0) - (aStock ? getNumberInStock(aStock) : 0)
    )
  })
}
