import React, { useState } from 'react'
import { ActionMenu, BodyShort, Box, Button, HGrid, HStack, Label, Link, Stack, Tag, VStack } from '@navikt/ds-react'
import styles from '@/app/gjenbruksprodukter/AlternativeProducts.module.scss'
import NextLink from 'next/link'
import ProductImage from '@/components/ProductImage'
import {
  ArrowsSquarepathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MenuElipsisVerticalCircleIcon,
} from '@navikt/aksel-icons'
import { AlternativeProduct, WarehouseStock } from '@/app/gjenbruksprodukter/alternative-util'
import { useHydratedAlternativeProductsCompareStore } from '@/utils/compare-alternatives-state-util'
import { logNavigationEvent } from '@/utils/amplitude'

export const AlternativeProductCard = ({
  alternativeProduct,
  selectedWarehouseStock,
  handleCompareClick,
  editMode,
  onDelete,
}: {
  alternativeProduct: AlternativeProduct
  selectedWarehouseStock: WarehouseStock | undefined
  handleCompareClick?: () => void
  editMode: boolean
  onDelete: () => void
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
      {editMode && (
        <div className={styles.editMenu}>
          <EditMenu onDelete={onDelete} />
        </div>
      )}
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
  const numberInStock = selectedWarehouseStock ? selectedWarehouseStock.actualAvailable : undefined

  return (
    <VStack justify="space-between" padding={'5'} gap={'2'} className={styles.productContainer}>
      <HStack justify="space-between">
        <VStack gap={'1'} className={styles.productProperties}>
          <HStack gap={'2'} align={'center'}>
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
            onClick={() => {
              logNavigationEvent('alternativprodukter', 'produktkort', alternativeProduct.seriesTitle)
            }}
          >
            {alternativeProduct.seriesTitle}
          </Link>
          <BodyShort size="small" weight="semibold">
            {alternativeProduct.variantTitle}
          </BodyShort>
          <BodyShort size="small">{alternativeProduct.supplierName}</BodyShort>
          <BodyShort size="small">HMS: {alternativeProduct.hmsArtNr}</BodyShort>
        </VStack>
        <Box paddingInline="2" paddingBlock="2" className={styles.imageWrapper}>
          <ProductImage src={alternativeProduct.imageUri} productTitle={'produktbilde'}></ProductImage>
        </Box>
      </HStack>
      <HStack align={'end'} justify={'space-between'} gap={'2'} wrap={false}>
        {alternativeProduct.warehouseStock === undefined && (
          <Tag variant="neutral" size={'small'}>
            Ukjent lagerstatus
          </Tag>
        )}

        {!alternativeProduct.inStockAnyWarehouse && alternativeProduct.warehouseStock && (
          <Tag variant="neutral" size={'small'}>
            Ikke på noen lager
          </Tag>
        )}

        {alternativeProduct.inStockAnyWarehouse && alternativeProduct.warehouseStock && (
          <>
            <VStack gap={'2'}>
              {selectedWarehouseStock && (
                <HStack gap={'2'}>
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
                  logNavigationEvent(
                    'alternativprodukter',
                    'lagerstatus',
                    selectedWarehouseStock ? selectedWarehouseStock.location : ''
                  )
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
  )
}

const WarehouseStatus = ({ stocks }: { stocks: WarehouseStock[] | undefined }) => {
  return (
    <HGrid gap="2" columns={2} className={styles.locationInfoContainer}>
      {stocks
        ?.filter((stock) => stock.actualAvailable > 0)
        .map((stock) => (
          <LocationInfo stock={stock} key={stock.location} />
        ))}
    </HGrid>
  )
}

const LocationInfo = ({ stock }: { stock: WarehouseStock }) => {
  return (
    <VStack className={styles.locationInfo} gap={'2'}>
      <Label>{stock.location}</Label>
      {<StockTag amount={stock.actualAvailable} />}
    </VStack>
  )
}

const StockTag = ({ amount }: { amount: number }) => {
  if (amount === 0) {
    return (
      <Tag variant="neutral" size={'small'}>
        Ingen på lager
      </Tag>
    )
  } else
    return (
      <Tag variant="success" size={'small'}>
        {amount} stk på lager
      </Tag>
    )
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
    logNavigationEvent('alternativprodukter', 'sammenlign', product.variantTitle)

    const foundProductInCompareList =
      alternativeProductsToCompare.filter((procom: AlternativeProduct) => product.id === procom.id).length === 1
    if (foundProductInCompareList) {
      removeAlternativeProduct(product.id)
    } else {
      setAlternativeProductToCompare(product)
    }
  }

  const isInProductsToCompare = alternativeProductsToCompare.filter((procom) => product.id === procom.id).length >= 1
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

const EditMenu = ({ onDelete }: { onDelete: () => void }) => {
  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button variant="tertiary" icon={<MenuElipsisVerticalCircleIcon aria-hidden />} iconPosition="right"></Button>
      </ActionMenu.Trigger>
      <ActionMenu.Content>
        <ActionMenu.Item onSelect={onDelete}>Slett</ActionMenu.Item>
      </ActionMenu.Content>
    </ActionMenu>
  )
}
