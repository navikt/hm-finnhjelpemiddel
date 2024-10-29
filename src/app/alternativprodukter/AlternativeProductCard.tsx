import React, { Dispatch, SetStateAction, useState } from 'react'
import { BodyShort, Box, Button, HGrid, HStack, Label, Link, Stack, Tag, VStack } from '@navikt/ds-react'
import styles from '@/app/alternativprodukter/AlternativeProducts.module.scss'
import NextLink from 'next/link'
import ProductImage from '@/components/ProductImage'
import { ChevronDownIcon, XMarkIcon } from '@navikt/aksel-icons'
import { getNumberInStock } from '@/app/alternativprodukter/AlternativeProductsList'
import { AlternativeProducti, WarehouseStocki } from '@/utils/product-util'

export const AlternativeProductCard = ({
  alternativeProduct,
  currentWarehouse,
  currentWarehouseStock,
}: {
  alternativeProduct: AlternativeProducti
  currentWarehouse?: string | undefined
  currentWarehouseStock: WarehouseStocki | undefined
}) => {
  const [openWarehouseStock, setOpenWarehouseStock] = useState(false)
  const stocks = alternativeProduct.warehouseStock

  return (
    <Stack align={'start'} direction={{ xs: 'column', lg: 'row' }} className={styles.alternativeProductContainer}>
      <ProductInfo
        alternativeProduct={alternativeProduct}
        setOpenWarehouseStock={setOpenWarehouseStock}
        openWarehouseStock={openWarehouseStock}
        currentWarehouse={currentWarehouse}
        currentWarehouseStock={currentWarehouseStock}
      />

      {openWarehouseStock && <WarehouseStatus stocks={stocks} setOpenWarehouseStock={setOpenWarehouseStock} />}
    </Stack>
  )
}

const ProductInfo = ({
  alternativeProduct,
  currentWarehouse,
  currentWarehouseStock,
  setOpenWarehouseStock,
  openWarehouseStock,
}: {
  alternativeProduct: AlternativeProducti
  currentWarehouse?: string | undefined
  currentWarehouseStock: WarehouseStocki | undefined
  setOpenWarehouseStock: (value: boolean) => any
  openWarehouseStock: boolean
}) => {
  const variant = alternativeProduct.variants[0]
  const numberInStock = currentWarehouseStock ? getNumberInStock(currentWarehouseStock) : undefined

  return (
    <VStack justify="space-between" padding={'5'} className={styles.productContainer}>
      <HStack justify="space-between">
        <VStack gap={'3'} className={styles.productProperties}>
          {variant.agreements.length === 0 ? (
            <Label size="small" className={styles.notInAgreementColor}>
              Ikke på avtale
            </Label>
          ) : (
            <Label size="small" className={styles.headerColor}>
              NAV - Rangering {variant.agreements[0].rank}
            </Label>
          )}
          <Link as={NextLink} href={`/produkt/${alternativeProduct.id}`} className={styles.link}>
            {alternativeProduct.title}
          </Link>
          {variant.status === 'INACTIVE' && (
            <Tag size="small" variant="neutral-moderate" className={styles.expiredTag}>
              Utgått
            </Tag>
          )}
          <BodyShort size="small">{alternativeProduct.supplierName}</BodyShort>
          <BodyShort size="small">HMS: {variant.hmsArtNr}</BodyShort>
        </VStack>
        <Box paddingInline="2" paddingBlock="2" className={styles.imageWrapper}>
          <ProductImage src={alternativeProduct.photos[0]?.uri} productTitle={'produktbilde'}></ProductImage>
        </Box>
      </HStack>
      <HStack align={'center'} justify={'space-between'} gap={'2'}>
        {currentWarehouse && (
          <HStack gap={'2'}>
            <b>{currentWarehouse}:</b>
            {numberInStock !== undefined && <StockTag amount={numberInStock} />}
          </HStack>
        )}
        <Button
          variant={'secondary'}
          size={'small'}
          icon={<ChevronDownIcon />}
          iconPosition={'right'}
          onClick={() => setOpenWarehouseStock(!openWarehouseStock)}
        >
          Se lagerstatus
        </Button>
      </HStack>
    </VStack>
  )
}

const WarehouseStatus = ({
  stocks,
  setOpenWarehouseStock,
}: {
  stocks: WarehouseStocki[] | undefined
  setOpenWarehouseStock: Dispatch<SetStateAction<boolean>>
}) => {
  return (
    <VStack gap={'4'} className={styles.warehouseStatus}>
      <HStack gap={'2'} justify={'space-between'} align={'center'}>
        <Label>Lagerstatus</Label>
        <Button
          variant={'tertiary'}
          size={'small'}
          icon={<XMarkIcon fontSize={'1.5rem'} />}
          onClick={() => setOpenWarehouseStock(false)}
          className={styles.closeButton}
        />
      </HStack>
      <HGrid gap="2" columns={2} className={styles.locationInfoContainer}>
        {stocks?.map((stock) => (
          <li key={stock.location}>
            <LocationInfo stock={stock} />
          </li>
        ))}
      </HGrid>
    </VStack>
  )
}

const LocationInfo = ({ stock }: { stock: WarehouseStocki }) => {
  const amount = stock ? Math.max(stock.available - stock.needNotified, 0) : undefined
  const warehouseName = stock.location.substring(4)
  return (
    <HStack className={styles.locationInfo} gap={'2'}>
      <Label>{warehouseName}</Label>
      {amount !== undefined && <StockTag amount={amount} />}
    </HStack>
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
