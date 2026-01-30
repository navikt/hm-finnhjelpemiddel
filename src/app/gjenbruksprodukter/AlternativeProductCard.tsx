import React, { useState } from 'react'
import { BodyShort, Box, Button, HelpText, HGrid, HStack, Label, Link, Stack, Tag, VStack } from '@navikt/ds-react'
import styles from '@/app/gjenbruksprodukter/AlternativeProducts.module.scss'
import NextLink from 'next/link'
import ProductImage from '@/components/ProductImage'
import { ArrowsSquarepathIcon, ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { AlternativeProduct, WarehouseStock } from '@/app/gjenbruksprodukter/alternative-util'
import { useHydratedAlternativeProductsCompareStore } from '@/utils/compare-alternatives-state-util'
import { NeutralTag, SuccessTag } from '@/components/Tags'

export const AlternativeProductCard = ({
  alternativeProduct,
  selectedWarehouseStock,
  handleCompareClick,
}: {
  alternativeProduct: AlternativeProduct
  selectedWarehouseStock: WarehouseStock | undefined
  handleCompareClick?: () => void
}) => {
  const [openWarehouseStock, setOpenWarehouseStock] = useState(false)
  const stocks = alternativeProduct.warehouseStock

  return (
    <Stack align={'start'} direction={'column'} className={styles.alternativeProductContainer}>
      <ProductInfo
        alternativeProduct={alternativeProduct}
        setOpenWarehouseStock={setOpenWarehouseStock}
        openWarehouseStock={openWarehouseStock}
        selectedWarehouseStock={selectedWarehouseStock}
        handleCompareClick={handleCompareClick}
      />

      {openWarehouseStock && <WarehouseStatus stocks={stocks} />}
    </Stack>
  )
}

const ProductInfo = ({
  alternativeProduct,
  selectedWarehouseStock,
  setOpenWarehouseStock,
  openWarehouseStock,
  handleCompareClick,
}: {
  alternativeProduct: AlternativeProduct
  selectedWarehouseStock: WarehouseStock | undefined
  setOpenWarehouseStock: (value: boolean) => any
  openWarehouseStock: boolean
  handleCompareClick?: () => void
}) => {
  const numberInStock = selectedWarehouseStock ? selectedWarehouseStock.available : undefined

  return (
    <VStack justify="space-between" padding={"space-20"} gap={"space-8"} className={styles.productContainer}>
      <HStack justify="space-between">
        <VStack gap={"space-4"} className={styles.productProperties}>
          <HStack gap={"space-8"} align={'center'}>
            {alternativeProduct.onAgreement ? (
              <Label size="small" className={styles.headerColor}>
                NAV - Rangering {alternativeProduct.highestRank}
              </Label>
            ) : (
              <Label size="small" className={styles.notInAgreementColor}>
                Ikke på avtale
              </Label>
            )}
            {alternativeProduct.status === 'INACTIVE' && (
              <Tag size="xsmall" variant="neutral-moderate" className={styles.expiredTag}>
                Utgått
              </Tag>
            )}
          </HStack>
          <Link
            as={NextLink}
            href={`/produkt/${alternativeProduct.seriesId}?term=${alternativeProduct.hmsArtNr}`}
            className={styles.link}
          >
            {alternativeProduct.seriesTitle}
          </Link>
          <BodyShort size="small" weight="semibold">
            {alternativeProduct.variantTitle}
          </BodyShort>
          <BodyShort size="small">{alternativeProduct.supplierName}</BodyShort>
          <BodyShort size="small">HMS: {alternativeProduct.hmsArtNr}</BodyShort>
        </VStack>
        <Box paddingInline="space-8" paddingBlock="space-8" className={styles.imageWrapper}>
          <ProductImage src={alternativeProduct.imageUri} productTitle={'produktbilde'}></ProductImage>
        </Box>
      </HStack>
      <HStack align={'end'} justify={'space-between'} gap={"space-8"} wrap={false}>
        {alternativeProduct.warehouseStock === undefined && (
          <HStack gap={"space-8"}>
            <NeutralTag>Ukjent lagerstatus</NeutralTag>
            <HelpText>Vi har ikke fått lagerstatus for dette produktet fra OeBS enda</HelpText>
          </HStack>
        )}

        {!alternativeProduct.inStockAnyWarehouse && alternativeProduct.warehouseStock && (
          <NeutralTag>Ikke på noen lager</NeutralTag>
        )}

        {alternativeProduct.inStockAnyWarehouse && alternativeProduct.warehouseStock && (
          <>
            <VStack gap={"space-8"}>
              {selectedWarehouseStock && (
                <HStack gap={"space-8"}>
                  <b>{selectedWarehouseStock.location}:</b>
                  {numberInStock !== undefined && <StockTag amount={numberInStock} />}
                </HStack>
              )}
              <Button
                className={openWarehouseStock ? styles.toggledButton : ''}
                variant={'secondary'}
                size={'small'}
                icon={openWarehouseStock ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
                iconPosition={'right'}
                onClick={() => {
                  setOpenWarehouseStock(!openWarehouseStock)
                }}
              >
                Se lagerstatus
              </Button>
            </VStack>
          </>
        )}
        <CompareButton product={alternativeProduct} handleCompareClick={handleCompareClick} />
      </HStack>
    </VStack>
  );
}

const WarehouseStatus = ({ stocks }: { stocks: WarehouseStock[] | undefined }) => {
  return (
    <HGrid gap="space-8" columns={2} className={styles.locationInfoContainer}>
      {stocks
        ?.filter((stock) => stock.available > 0)
        .map((stock) => (
          <LocationInfo stock={stock} key={stock.location} />
        ))}
    </HGrid>
  );
}

const LocationInfo = ({ stock }: { stock: WarehouseStock }) => {
  return (
    <VStack className={styles.locationInfo} gap={"space-8"}>
      <Label>{stock.location}</Label>
      {<StockTag amount={stock.available} />}
    </VStack>
  );
}

const StockTag = ({ amount }: { amount: number }) => {
  if (amount === 0) {
    return <NeutralTag>Ingen på lager</NeutralTag>
  } else return <SuccessTag>{amount} stk på lager</SuccessTag>
}

const CompareButton = ({
  product,
  handleCompareClick,
}: {
  product: AlternativeProduct
  handleCompareClick: (() => void) | undefined
}) => {
  const { setAlternativeProductToCompare, removeAlternativeProduct, alternativeProductsToCompare } =
    useHydratedAlternativeProductsCompareStore()

  const toggleCompareProduct = () => {
    handleCompareClick && handleCompareClick()

    const foundProductInCompareList =
      alternativeProductsToCompare.filter((procom: AlternativeProduct) => product.variantId === procom.variantId)
        .length === 1
    if (foundProductInCompareList) {
      removeAlternativeProduct(product.variantId)
    } else {
      setAlternativeProductToCompare(product)
    }
  }

  const isInProductsToCompare =
    alternativeProductsToCompare.filter((procom) => product.variantId === procom.variantId).length >= 1
  return (
    <Button
      className={isInProductsToCompare ? styles.toggledButton : ''}
      size="small"
      variant="secondary"
      value="Legg produktet til sammenligning"
      onClick={toggleCompareProduct}
      icon={<ArrowsSquarepathIcon aria-hidden />}
      iconPosition="left"
      aria-pressed={isInProductsToCompare}
    >
      <div aria-label={`sammenlign ${product.variantTitle}`}>
        <span aria-hidden>Sammenlign</span>
      </div>
    </Button>
  )
}
