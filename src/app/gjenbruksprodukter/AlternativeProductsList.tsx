import { BodyShort, Button, HGrid, HStack, Loader, TextField, VStack } from '@navikt/ds-react'
import { Heading } from '@/components/aksel-client'
import React, { useState } from 'react'
import { AlternativeProductCard } from '@/app/gjenbruksprodukter/AlternativeProductCard'
import {
  AlternativeProduct,
  createAlternativeMapping,
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

export const AlternativeProductList = ({
  hmsNumber,
  selectedWarehouse,
}: {
  hmsNumber: string
  selectedWarehouse?: string | undefined
}) => {
  const editMode: boolean = true

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
  } = useSWRImmutable<Product[]>(alternativesResponse ? hmsNumber : null, () => getProductFromHmsArtNrs([hmsNumber]))

  const { setCompareAlternativesMenuState } = useHydratedAlternativeProductsCompareStore()
  const [firstCompareClick, setFirstCompareClick] = useState(true)

  if (errorAlternatives || errorAlternativeProducts || errorOriginalProduct) {
    return <>En feil har skjedd ved henting av data</>
  }

  if (isLoadingAlternatives || isLoadingAlternativeProducts || isLoadingOriginalProduct) {
    return <Loader />
  }

  if (!originalProductResponse || !alternativesResponse || !alternativeProductsResponse) {
    return <>Finner ikke produkt {hmsNumber}</>
  }

  const original = mapToAlternativeProduct(originalProductResponse[0], alternativesResponse.original.warehouseStock)

  const alternatives: AlternativeProduct[] = alternativeProductsResponse.map((product) => {
    const stocks = alternativeStocks!.find((alt) => alt.hmsArtNr === product.variants[0].hmsArtNr)?.warehouseStock!
    return mapToAlternativeProduct(product, stocks)
  })

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
          originalHmsArtNr={hmsNumber}
          editMode={false}
          mutateAlternatives={mutateAlternatives}
        />
      </div>
      <VStack gap={'4'}>
        <Heading size="medium">Alternative produkter</Heading>
        {editMode && <AddAlternative sourceHmsArtNr={hmsNumber} mutateAlternatives={mutateAlternatives} />}
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
                  originalHmsArtNr={hmsNumber}
                  editMode={editMode}
                  mutateAlternatives={mutateAlternatives}
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

const mapToAlternativeProduct = (product: Product, stocks: WarehouseStockResponse[]): AlternativeProduct => {
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
      .filter((stock) => stock.location != 'Telemark')
      .map((stock) => {
        return {
          location: stock.location,
          available: stock.available,
          reserved: stock.reserved,
          needNotified: stock.needNotified,
          actualAvailable: Math.max(stock.available - stock.needNotified, 0),
        }
      }),
    inStockAnyWarehouse: !!stocks.find((stock) => stock.available - stock.needNotified > 0),
  }
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

export const AddAlternative = ({
  sourceHmsArtNr,
  mutateAlternatives,
}: {
  sourceHmsArtNr: string
  mutateAlternatives: () => void
}) => {
  const [targetHmsArtNr, setTargetHmsArtNr] = useState('')

  return (
    <HStack gap={'2'} align={'end'}>
      <TextField
        value={targetHmsArtNr}
        label="Legg til alternativ"
        onChange={(event) => setTargetHmsArtNr(event.currentTarget.value)}
      />
      <Button onClick={() => createAlternativeMapping(sourceHmsArtNr, targetHmsArtNr).then(() => mutateAlternatives())}>
        Legg til
      </Button>
    </HStack>
  )
}
