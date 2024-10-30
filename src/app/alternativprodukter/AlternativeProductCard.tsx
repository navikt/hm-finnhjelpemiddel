import React, { Dispatch, SetStateAction, useState } from 'react'
import { BodyShort, Box, Button, HGrid, HStack, Label, Link, Stack, Tag, VStack } from '@navikt/ds-react'
import styles from '@/app/alternativprodukter/AlternativeProducts.module.scss'
import NextLink from 'next/link'
import ProductImage from '@/components/ProductImage'
import { ChevronDownIcon, XMarkIcon } from '@navikt/aksel-icons'
import { AlternativeProduct, WarehouseStock } from '@/app/alternativprodukter/alternative-util'

export const AlternativeProductCard = ({
  alternativeProduct,
  currentWarehouse,
  currentWarehouseStock,
}: {
  alternativeProduct: AlternativeProduct
  currentWarehouse?: string | undefined
  currentWarehouseStock: WarehouseStock | undefined
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
  alternativeProduct: AlternativeProduct
  currentWarehouse?: string | undefined
  currentWarehouseStock: WarehouseStock | undefined
  setOpenWarehouseStock: (value: boolean) => any
  openWarehouseStock: boolean
}) => {
  const numberInStock = currentWarehouseStock ? currentWarehouseStock.actualAvailable : undefined

  return (
    <VStack justify="space-between" padding={'5'} className={styles.productContainer}>
      <HStack justify="space-between">
        <VStack gap={'3'} className={styles.productProperties}>
          {alternativeProduct.onAgreement ? (
            <Label size="small" className={styles.headerColor}>
              NAV - Rangering {alternativeProduct.highestRank}
            </Label>
          ) : (
            <Label size="small" className={styles.notInAgreementColor}>
              Ikke på avtale
            </Label>
          )}
          <Link as={NextLink} href={`/produkt/${alternativeProduct.seriesId}`} className={styles.link}>
            {alternativeProduct.title}
          </Link>
          {alternativeProduct.status === 'INACTIVE' && (
            <Tag size="small" variant="neutral-moderate" className={styles.expiredTag}>
              Utgått
            </Tag>
          )}
          <BodyShort size="small">{alternativeProduct.supplierName}</BodyShort>
          <BodyShort size="small">HMS: {alternativeProduct.hmsArtNr}</BodyShort>
        </VStack>
        <Box paddingInline="2" paddingBlock="2" className={styles.imageWrapper}>
          <ProductImage src={alternativeProduct.imageUri} productTitle={'produktbilde'}></ProductImage>
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
          icon={<ChevronDownIcon aria-hidden />}
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
  stocks: WarehouseStock[] | undefined
  setOpenWarehouseStock: Dispatch<SetStateAction<boolean>>
}) => {
  return (
    <VStack gap={'4'} className={styles.warehouseStatus}>
      <HStack gap={'2'} justify={'space-between'} align={'center'}>
        <Label>Lagerstatus</Label>
        <Button
          variant={'tertiary'}
          title={'Lukk'}
          size={'small'}
          icon={<XMarkIcon fontSize={'1.5rem'} aria-hidden />}
          onClick={() => setOpenWarehouseStock(false)}
          className={styles.closeButton}
        />
      </HStack>
      <HGrid gap="2" columns={2} className={styles.locationInfoContainer}>
        {stocks?.map((stock) => <LocationInfo stock={stock} key={stock.location} />)}
      </HGrid>
    </VStack>
  )
}

const LocationInfo = ({ stock }: { stock: WarehouseStock }) => {
  const amount = stock ? Math.max(stock.available - stock.needNotified, 0) : undefined
  return (
    <HStack className={styles.locationInfo} gap={'2'}>
      <Label>{stock.location}</Label>
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
