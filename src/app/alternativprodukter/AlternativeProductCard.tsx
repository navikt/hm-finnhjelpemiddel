import { AlternativeProduct, WarehouseStock } from '@/app/alternativprodukter/page'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { BodyShort, Box, Button, HGrid, HStack, Label, Link, Tag, VStack } from '@navikt/ds-react'
import styles from '@/app/alternativprodukter/AlternativeProducts.module.scss'
import NextLink from 'next/link'
import ProductImage from '@/components/ProductImage'
import { ChevronDownIcon, XMarkIcon } from '@navikt/aksel-icons'
import { getNumberInStock } from '@/app/alternativprodukter/AlternativeProductsList'

export const AlternativeProductCard = ({
  alternativeProduct,
  currentWarehouse,
}: {
  alternativeProduct: AlternativeProduct
  currentWarehouse?: string | undefined
}) => {
  const [openWarehouseStock, setOpenWarehouseStock] = useState(false)
  const stocks = alternativeProduct.stocks

  return (
    <HStack align={'start'} className={styles.alternativeProductContainer}>
      <ProductInfo
        alternativeProduct={alternativeProduct}
        setOpenWarehouseStock={setOpenWarehouseStock}
        openWarehouseStock={openWarehouseStock}
        currentWarehouse={currentWarehouse}
      />

      {openWarehouseStock && <WarehouseStatus stocks={stocks} setOpenWarehouseStock={setOpenWarehouseStock} />}
    </HStack>
  )
}

const ProductInfo = ({
  alternativeProduct,
  currentWarehouse,
  setOpenWarehouseStock,
  openWarehouseStock,
}: {
  alternativeProduct: AlternativeProduct
  currentWarehouse?: string | undefined
  setOpenWarehouseStock: (value: boolean) => any
  openWarehouseStock: boolean
}) => {
  const product = alternativeProduct.product
  const variant = alternativeProduct.product.variants[0]
  const currentWarehouseStock = alternativeProduct.currentWarehouseStock
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
          <Link as={NextLink} href={`/produkt/${product.id}`} className={styles.link}>
            {product.title}
          </Link>
          {variant.status === 'INACTIVE' && (
            <Tag size="small" variant="neutral-moderate" className={styles.expiredTag}>
              Utgått
            </Tag>
          )}
          <BodyShort size="small">{product.supplierName}</BodyShort>
          <BodyShort size="small">HMS: {variant.hmsArtNr}</BodyShort>
        </VStack>
        <Box paddingInline="2" paddingBlock="2" className={styles.imageWrapper}>
          <ProductImage src={product.photos[0]?.uri} productTitle={'produktbilde'}></ProductImage>
        </Box>
      </HStack>
      <HStack align={'center'} justify={'space-between'} gap={'2'}>
        {currentWarehouse && (
          <>
            <b>{currentWarehouse}:</b>
            {numberInStock !== undefined && <StockTag amount={numberInStock} />}
          </>
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
  stocks: WarehouseStock[] | undefined
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
          <li key={stock.organisasjons_id}>
            <LocationInfo stock={stock} />
          </li>
        ))}
      </HGrid>
    </VStack>
  )
}

const LocationInfo = ({ stock }: { stock: WarehouseStock }) => {
  const amount = stock ? Math.max(stock.tilgjengelig - stock.behovsmeldt, 0) : undefined
  const warehouseName = stock.organisasjons_navn.substring(4)
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
