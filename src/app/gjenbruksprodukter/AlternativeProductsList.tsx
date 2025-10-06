import { BodyShort, HGrid, Loader, VStack } from '@navikt/ds-react'
import { Heading } from '@/components/aksel-client'
import React, { useState } from 'react'
import { AlternativeProductCard } from '@/app/gjenbruksprodukter/AlternativeProductCard'
import {
  AlternativeProduct,
  deleteAlternativeMapping,
  getAlternativesAndStock,
  WarehouseStock,
} from '@/app/gjenbruksprodukter/alternative-util'
import useSWRImmutable from 'swr/immutable'
import CompareAlternativeProductsMenu from '@/components/layout/CompareAlternativeProductsMenu'
import {
  CompareAlternativesMenuState,
  useHydratedAlternativeProductsCompareStore,
} from '@/utils/compare-alternatives-state-util'
import { Product } from '@/utils/product-util'
import { getProductFromHmsArtNrs } from '@/utils/api-util'
import { WarehouseStockResponse } from '@/utils/response-types'
import { AddAlternative } from '@/app/gjenbruksprodukter/AddAlternative'
import { useFeatureFlags } from '@/hooks/useFeatureFlag'

export const AlternativeProductList = ({
  hmsNumber,
  selectedWarehouse,
}: {
  hmsNumber: string
  selectedWarehouse?: string | undefined
}) => {
  const featureFlags = useFeatureFlags()

  const editMode: boolean = featureFlags.isEnabled('finnhjelpemiddel.visAlternativEdit') ?? false

  const {
    data: alternativesResponse,
    isLoading: isLoadingAlternatives,
    error: errorAlternatives,
    mutate: mutateAlternatives,
  } = useSWRImmutable(`asdasd-${hmsNumber}`, () => getAlternativesAndStock(hmsNumber))

  const alternativeStocks = alternativesResponse?.alternatives
  const hmsArtNrs = alternativeStocks?.map((alternativeStock) => alternativeStock.hmsArtNr) ?? []

  const {
    data: alternativeProductsResponse,
    isLoading: isLoadingAlternativeProducts,
    error: errorAlternativeProducts,
  } = useSWRImmutable<Product[]>(
    alternativesResponse ? [`alternatives-${hmsNumber}`, alternativesResponse] : null,
    () => getProductFromHmsArtNrs(hmsArtNrs)
  )

  const {
    data: originalProductResponse,
    isLoading: isLoadingOriginalProduct,
    error: errorOriginalProduct,
  } = useSWRImmutable<Product[]>(hmsNumber, () => getProductFromHmsArtNrs([hmsNumber]))

  const { setCompareAlternativesMenuState } = useHydratedAlternativeProductsCompareStore()
  const [firstCompareClick, setFirstCompareClick] = useState(true)

  const [newAlternative, setNewAlternative] = useState<AlternativeProduct | undefined>(undefined)

  if (errorAlternatives || errorAlternativeProducts || errorOriginalProduct) {
    return <>En feil har skjedd ved henting av data</>
  }

  if (isLoadingAlternatives || isLoadingAlternativeProducts || isLoadingOriginalProduct) {
    return <Loader />
  }

  if (!originalProductResponse) {
    return <>Finner ikke produkt {hmsNumber}</>
  }

  //Skjuler original-produktkort med ukjent lagerstatus for de uten edit-tilgang for nå
  if (!editMode && (!alternativesResponse || !alternativeProductsResponse)) {
    return <>Finner ikke produkt {hmsNumber}</>
  }

  const original = mapToAlternativeProduct(originalProductResponse[0], alternativesResponse?.original.warehouseStock)

  const alternatives: AlternativeProduct[] =
    alternativeProductsResponse?.map((product) => {
      const stocks = alternativeStocks!.find((alt) => alt.hmsArtNr === product.variants[0].hmsArtNr)?.warehouseStock!
      return mapToAlternativeProduct(product, stocks)
    }) ?? []

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
          editMode={false}
          onDelete={() => {}}
        />
      </div>
      <VStack gap={'4'}>
        <Heading size="medium">Alternative produkter</Heading>
        {editMode && <AddAlternative sourceHmsArtNr={hmsNumber} setNewAlternative={setNewAlternative} />}
        <HGrid gap={'4'} columns={{ sm: 1, md: 1 }}>
          {newAlternative && (
            <AlternativeProductCard
              alternativeProduct={newAlternative}
              selectedWarehouseStock={undefined}
              key={newAlternative.id}
              handleCompareClick={handleCompareClick}
              editMode={editMode}
              onDelete={() =>
                deleteAlternativeMapping(hmsNumber, newAlternative.hmsArtNr!).then(() => {
                  setNewAlternative(undefined)
                })
              }
            />
          )}
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
                  editMode={editMode}
                  onDelete={() =>
                    deleteAlternativeMapping(hmsNumber, alternative.hmsArtNr!).then(() => mutateAlternatives())
                  }
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

export const mapToAlternativeProduct = (
  product: Product,
  stocks: WarehouseStockResponse[] | undefined
): AlternativeProduct => {
  const variant = product.variants[0]
  return {
    seriesId: product.id,
    id: variant.id,
    seriesTitle: product.title,
    variantTitle: variant.articleName,
    status: variant.status,
    hmsArtNr: variant.hmsArtNr,
    imageUri: product.photos[0]?.uri,
    supplierName: product.supplierName,
    highestRank:
      variant.agreements.length > 0 ? Math.max(...variant.agreements.map((agreement) => agreement.rank)) : 99,
    onAgreement: variant.agreements.length > 0,
    warehouseStock: stocks
      ?.filter((stock) => stock.location != 'Telemark')
      .map((stock) => {
        return {
          location: stock.location,
          available: stock.available,
          reserved: stock.reserved,
          needNotified: stock.needNotified,
          actualAvailable: Math.max(stock.available - stock.needNotified, 0),
        }
      }),
    inStockAnyWarehouse: !!stocks?.find((stock) => stock.available - stock.needNotified > 0),
  }
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
