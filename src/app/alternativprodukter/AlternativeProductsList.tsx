import { getAlternativeProductFromHmsArtNr } from '@/utils/api-util'
import useSWR from 'swr'
import { AlternativeProducti, WarehouseStocki } from '@/utils/product-util'
import { HGrid, Loader } from '@navikt/ds-react'
import { Heading } from '@/components/aksel-client'
import React from 'react'
import { AlternativeProductCard } from '@/app/alternativprodukter/AlternativeProductCard'

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
  } = useSWR<AlternativeProducti[]>(`alts-${hmsNumber}`, () => getAlternativeProductFromHmsArtNr(hmsNumber))

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

export const getNumberInStock = (warehouseStock: WarehouseStocki) => {
  return Math.max(warehouseStock.available - warehouseStock.needNotified, 0)
}

const getWarehouseStock = (
  selectedWarehouse: string | undefined,
  warehouseStocks: WarehouseStocki[]
): WarehouseStocki | undefined => {
  return selectedWarehouse
    ? warehouseStocks.find((stockLocation) => stockLocation.location.includes(selectedWarehouse))
    : undefined
}

const sortAlternativeProducts = (alternativeProducts: AlternativeProducti[], currentWarehouse?: string | undefined) => {
  alternativeProducts.sort((a, b) => {
    const aStock = getWarehouseStock(currentWarehouse, a.warehouseStock)
    const bStock = getWarehouseStock(currentWarehouse, b.warehouseStock)

    if (a.agreements.length === 0 && b.agreements.length === 0) {
      return (bStock ? getNumberInStock(bStock) : 0) - (aStock ? getNumberInStock(aStock) : 0)
    }
    if (a.agreements.length === 0) {
      return 1
    }
    if (b.agreements.length === 0) {
      return -1
    }
    return (
      a.agreements[0].rank - b.agreements[0].rank ||
      (bStock ? getNumberInStock(bStock) : 0) - (aStock ? getNumberInStock(aStock) : 0)
    )
  })
}
