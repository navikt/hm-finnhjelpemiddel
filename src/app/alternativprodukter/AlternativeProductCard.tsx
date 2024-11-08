import React, { Dispatch, SetStateAction, useState } from 'react'
import { BodyShort, Box, Button, Checkbox, HGrid, HStack, Label, Link, Stack, Tag, VStack } from '@navikt/ds-react'
import styles from '@/app/alternativprodukter/AlternativeProducts.module.scss'
import NextLink from 'next/link'
import ProductImage from '@/components/ProductImage'
import { ChevronDownIcon, XMarkIcon } from '@navikt/aksel-icons'
import { AlternativeProduct, WarehouseStock } from '@/app/alternativprodukter/alternative-util'
import { useHydratedCompareStore } from "@/utils/global-state-util";
import { useHydratedAlternativeProductsCompareStore } from "@/utils/compare-alternatives-state-util";

export const AlternativeProductCard = ({
  alternativeProduct,
  selectedWarehouseStock,
}: {
  alternativeProduct: AlternativeProduct
  selectedWarehouseStock: WarehouseStock | undefined
}) => {
  const [openWarehouseStock, setOpenWarehouseStock] = useState(false)
  const stocks = alternativeProduct.warehouseStock

  return (
    <Stack align={'start'} direction={{ xs: 'column', lg: 'row' }} className={styles.alternativeProductContainer}>
      <ProductInfo
        alternativeProduct={alternativeProduct}
        setOpenWarehouseStock={setOpenWarehouseStock}
        openWarehouseStock={openWarehouseStock}
        selectedWarehouseStock={selectedWarehouseStock}
      />

      {openWarehouseStock && <WarehouseStatus stocks={stocks} setOpenWarehouseStock={setOpenWarehouseStock} />}
    </Stack>
  )
}

const ProductInfo = ({
  alternativeProduct,
  selectedWarehouseStock,
  setOpenWarehouseStock,
  openWarehouseStock,
}: {
  alternativeProduct: AlternativeProduct
  selectedWarehouseStock: WarehouseStock | undefined
  setOpenWarehouseStock: (value: boolean) => any
  openWarehouseStock: boolean
}) => {
  const numberInStock = selectedWarehouseStock ? selectedWarehouseStock.actualAvailable : undefined

  return (
    <VStack justify="space-between" padding={'5'} className={styles.productContainer}>
      <HStack justify="space-between">
        <VStack gap={'1'} className={styles.productProperties}>
          <CompareCheckboxAP product={alternativeProduct} handleCompareClick={() => {}} />
          {alternativeProduct.onAgreement ? (
            <Label size="small" className={styles.headerColor}>
              NAV - Rangering {alternativeProduct.highestRank}
            </Label>
          ) : (
            <Label size="small" className={styles.notInAgreementColor}>
              Ikke på avtale
            </Label>
          )}
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
        {!alternativeProduct.inStockAnyWarehouse && (
          <Tag variant="neutral" size={'small'}>
            Ikke på lager hos noen sentraler
          </Tag>
        )}

        {alternativeProduct.inStockAnyWarehouse && (
          <>
            {selectedWarehouseStock && (
              <HStack gap={'2'}>
                <b>{selectedWarehouseStock.location}:</b>
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
          </>
        )}
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

const CompareCheckboxAP = ({
  product,
  handleCompareClick,
}: {
  product: AlternativeProduct
  handleCompareClick: (() => void) | undefined
}) => {
  const { setAlternativeProductToCompare, removeAlternativeProduct, alternativeProductsToCompare } = useHydratedAlternativeProductsCompareStore()

  const toggleCompareProduct = () => {
    handleCompareClick && handleCompareClick()


    const foundProductInCompareList = alternativeProductsToCompare.filter((procom: AlternativeProduct) => product.id === procom.id).length === 1
    if(foundProductInCompareList) {
      removeAlternativeProduct(product.id)
    } else {
      setAlternativeProductToCompare(product)
    }
  }

  const isInProductsToCompare = alternativeProductsToCompare.filter((procom) => product.id === procom.id).length >= 1
  return (
    <Checkbox
      className="product-card__checkbox"
      size="small"
      value="Legg produktet til sammenligning"
      onChange={toggleCompareProduct}
      checked={isInProductsToCompare}
    >
      <div aria-label={`sammenlign ${product.title}`}>
        <span aria-hidden>Sammenlign</span>
      </div>
    </Checkbox>
  )
}
