'use client'

import { useHydratedCompareStore } from '@/utils/global-state-util'
import { Product } from '@/utils/product-util'
import { ArrowsSquarepathIcon, ThumbUpIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, CopyButton, HStack, Link, Tag, VStack } from '@navikt/ds-react'
import classNames from 'classnames'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'
import ProductImage from '@/components/ProductImage'
import { logActionEvent, logNavigationEvent } from '@/utils/amplitude'
import styles from './ProductCardNew.module.scss'

export const ProductCardNew = ({
  product,
  linkOverwrite,
  rank,
  hmsNumbers,
  variantCount,
  handleCompareClick,
}: {
  product: Product
  linkOverwrite?: string
  rank?: number
  hmsNumbers?: string[]
  variantCount?: number
  handleCompareClick?: () => void
}) => {
  const minRank = product.agreements && Math.min(...product.agreements.map((agreement) => agreement.rank))

  const searchParams = useSearchParams()
  const linkToProduct = linkOverwrite || `/produkt/${product.id}?${searchParams}`

  const currentRank = rank ? rank : minRank
  const onAgreement = currentRank !== Infinity

  return (
    <Box padding={{ xs: '2', md: '4' }} className={styles.container}>
      <VStack width={'100%'}>
        {onAgreement && (
          <HStack gap={'2'} paddingBlock={{ xs: '0', md: '0 4' }}>
            <Tag variant={'success-moderate'} className={styles.agreementTag}>
              På avtale
            </Tag>
            <Tag variant={'success-moderate'} className={styles.agreementTag}>
              {`Rangering ${currentRank}`}
            </Tag>
          </HStack>
        )}

        <Box className={styles.imageWrapper}>
          <ProductImage src={product.photos.at(0)?.uri} productTitle={product.title} />
        </Box>

        <VStack gap={'2'} paddingBlock={{ xs: '1', md: '0 4' }}>
          <Link
            className={styles.link}
            href={linkToProduct}
            aria-label={`Gå til ${product.title}`}
            as={NextLink}
            onClick={() => logNavigationEvent('Produktkort', 'produkt', product.title)}
          >
            <BodyShort weight="semibold">{product.title}</BodyShort>
          </Link>

          <BodyShort size="small">{product.supplierName}</BodyShort>
        </VStack>
        {hmsNumbers && hmsNumbers?.length === 1 && (
          <VStack align={'start'} gap="1">
            <BodyShort size="small" weight="semibold">
              HMS-nummer
            </BodyShort>
            <CopyButton
              size="small"
              className={styles.hmsCopyButton}
              copyText={hmsNumbers[0]}
              text={hmsNumbers[0]}
              activeText="kopiert"
              variant="action"
              activeIcon={<ThumbUpIcon aria-hidden />}
              iconPosition="right"
              onClick={() => logActionEvent('kopier')}
            />
          </VStack>
        )}

        <Box paddingBlock={{ xs: '0 3', md: '0 8' }}>
          {((variantCount && hmsNumbers && hmsNumbers?.length > 1) || (variantCount && !hmsNumbers)) && (
            <BodyShort size="small">{`${variantCount} ${variantCount > 1 ? 'varianter' : 'variant'}`} </BodyShort>
          )}
        </Box>

        <CompareButton product={product} handleCompareClick={handleCompareClick} />
      </VStack>
    </Box>
  )
}

const CompareButton = ({
  product,
  handleCompareClick,
}: {
  product: Product
  handleCompareClick: (() => void) | undefined
}) => {
  const { setProductToCompare, removeProduct, productsToCompare } = useHydratedCompareStore()

  const toggleCompareProduct = () => {
    handleCompareClick && handleCompareClick()
    productsToCompare.filter((procom: Product) => product.id === procom.id).length === 1
      ? removeProduct(product.id)
      : setProductToCompare(product)
  }

  const isInProductsToCompare = productsToCompare.filter((procom: Product) => product.id === procom.id).length >= 1

  return (
    <Button
      className={classNames(styles.compareButton, {
        [styles.compareButtonChecked]: isInProductsToCompare,
      })}
      size="medium"
      variant="secondary"
      value="Legg produktet til sammenligning"
      onClick={toggleCompareProduct}
      icon={<ArrowsSquarepathIcon aria-hidden />}
      iconPosition="left"
      aria-pressed={isInProductsToCompare}
    >
      <div aria-label={`sammenlign ${product.title}`}>
        <span aria-hidden>Sammenlign</span>
      </div>
    </Button>
  )
}
