import { BodyShort, HGrid, Loader, VStack } from '@navikt/ds-react'
import { Heading } from '@/components/aksel-client'
import React, { useState } from 'react'
import { AlternativeProductCard } from '@/app/gjenbruksprodukter/AlternativeProductCard'
import {
  AlternativeProduct,
  AlternativeStockResponseNew,
  newGetAlternatives,
  WarehouseStock,
} from '@/app/gjenbruksprodukter/alternative-util'
import useSWRImmutable from 'swr/immutable'
import CompareAlternativeProductsMenu from '@/components/layout/CompareAlternativeProductsMenu'
import {
  CompareAlternativesMenuState,
  useHydratedAlternativeProductsCompareStore,
} from '@/utils/compare-alternatives-state-util'
import { useFeatureFlags } from '@/hooks/useFeatureFlag'

export const AlternativeProductList = ({
  hmsNumber,
  selectedWarehouse,
  userToken,
}: {
  hmsNumber: string
  selectedWarehouse?: string | undefined
  userToken: string
}) => {
  const featureFlags = useFeatureFlags()

  const editMode: boolean = featureFlags.isEnabled('finnhjelpemiddel.visAlternativEdit') ?? false

  const {
    data: alternativesResponse,
    isLoading: isLoadingAlternatives,
    error: errorAlternatives,
  } = useSWRImmutable<AlternativeStockResponseNew | undefined>(`alternatives-${hmsNumber}`, () =>
    newGetAlternatives(hmsNumber, userToken)
  )

  const { setCompareAlternativesMenuState } = useHydratedAlternativeProductsCompareStore()
  const [firstCompareClick, setFirstCompareClick] = useState(true)

  if (isLoadingAlternatives) {
    return <Loader />
  }

  if (errorAlternatives || !alternativesResponse) {
    return <>En feil har skjedd ved henting av data</>
  }

  if (!alternativesResponse.original) {
    return <>Finner ikke produkt {hmsNumber}</>
  }

  //Skjuler original-produktkort med ukjent lagerstatus for de uten edit-tilgang for nå
  if (!editMode && !alternativesResponse.original.warehouseStock) {
    return <>Finner ikke produkt {hmsNumber}</>
  }

  const original = alternativesResponse.original

  const alternatives: AlternativeProduct[] = alternativesResponse.alternatives ?? []

  console.log('original: ', original)
  console.log('alternatives: ', alternatives)

  if (alternatives) {
    sortAlternativeProducts(alternatives, selectedWarehouse)
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
      <VStack gap={'4'}>
        <Heading size="medium">Alternative produkter</Heading>
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
                  key={alternative.variantId}
                  handleCompareClick={handleCompareClick}
                />
              )
            })
          ) : (
            <BodyShort>Ingen kjente alternativer for produktet på lager</BodyShort>
          )}
        </HGrid>
      </VStack>
    </>
  )
}

const getSelectedWarehouseStock = (
  selectedWarehouse: string,
  warehouseStocks: WarehouseStock[] | undefined
): WarehouseStock | undefined => {
  return warehouseStocks?.find((stockLocation) => stockLocation.location.includes(selectedWarehouse))
}

const sortAlternativeProducts = (alternativeProducts: AlternativeProduct[], selectedWarehouse?: string | undefined) => {
  alternativeProducts.sort((a, b) => {
    const selectedWarehouseStockSort = selectedWarehouse
      ? (getSelectedWarehouseStock(selectedWarehouse, b.warehouseStock)?.available ?? 0) -
        (getSelectedWarehouseStock(selectedWarehouse, a.warehouseStock)?.available ?? 0)
      : 0

    const stockA = selectedWarehouse
      ? (getSelectedWarehouseStock(selectedWarehouse, a.warehouseStock)?.available ?? 0)
      : 0
    const stockB = selectedWarehouse
      ? (getSelectedWarehouseStock(selectedWarehouse, b.warehouseStock)?.available ?? 0)
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
