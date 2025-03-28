'use client'

import { Product } from '@/utils/product-util'
import ImageCarousel from '@/app/produkt/imageCarousel/ImageCarousel'
import { BodyShort, Button, CopyButton, HGrid, HStack, Link, Tag, VStack } from '@navikt/ds-react'
import { Heading } from '@/components/aksel-client'
import NextLink from 'next/link'
import styles from './ProductTop.module.scss'
import { ArrowDownIcon, ThumbUpIcon } from '@navikt/aksel-icons'
import { logActionEvent } from '@/utils/amplitude'
import { QrCodeButton } from '@/app/ny/produkt/[id]/QrCodeButton'

const ProductTop = ({ product }: { product: Product }) => {
  return (
    <HGrid columns={{ sm: 1, md: 2 }} gap={'8'}>
      {product.photos && <ImageCarousel images={product.photos} />}
      <ProductSummary product={product} />
    </HGrid>
  )
}

const ProductSummary = ({ product }: { product: Product }) => {
  const topRank =
    product.agreements &&
    product.agreements?.length > 0 &&
    Math.min(...product.agreements.map((agreement) => agreement.rank))

  const ingressifier = (text: string) => {
    const removeHtmlExp = new RegExp(/(<([^>]+)>)/gi)
    const cleanText = text.replace(removeHtmlExp, '')

    const words = cleanText.match(/(\w.*?\.)(?:\s[A-Z]|$)/)

    return words ? words[1] : ''
  }

  const descriptionIngress = product.attributes.text ? ingressifier(product.attributes.text) : ''

  return (
    <VStack gap={'4'}>
      <HStack justify={'space-between'}>
        {topRank && (
          <Tag variant={'success-moderate'} className={styles.agreementTag}>
            R{topRank}
          </Tag>
        )}
        <Link as={NextLink} href={`/leverandorer#${product.supplierId}`} className={styles.supplierLink}>
          {product.supplierName}
        </Link>
      </HStack>

      {product.agreements.length > 1 && <BodyShort>Hjelpemiddelet er på flere delkontrakter. </BodyShort>}
      {product.agreements.length === 1 && <BodyShort>Delkontrakt {product.agreements[0].postNr}</BodyShort>}

      <VStack gap={'2'}>
        <Heading level="1" size="large">
          {product.title}
        </Heading>
        {descriptionIngress}
      </VStack>

      <VStack gap={'6'} paddingBlock={'8'}>
        <CopyHms product={product} />
        <QrCodeButton id={product.id} />
      </VStack>
    </VStack>
  )
}

const CopyHms = ({ product }: { product: Product }) => {
  const hmsArtNumbers = new Set(product.variants.map((p) => p.hmsArtNr).filter((hms) => hms))

  if (hmsArtNumbers.size === 0) {
    return <></>
  }

  if (hmsArtNumbers.size === 1) {
    return (
      <VStack gap={'2'} align={'start'}>
        <Heading level="3" size="small">
          Kopier HMS-nummer
        </Heading>

        <CopyButton
          size="medium"
          className={styles.copyButton}
          copyText={[...hmsArtNumbers.values()][0] || ''}
          text={[...hmsArtNumbers.values()][0] || ''}
          activeText="kopiert"
          variant="action"
          activeIcon={<ThumbUpIcon aria-hidden />}
          iconPosition="right"
          onClick={() => logActionEvent('kopier')}
        />
      </VStack>
    )
  }

  if (hmsArtNumbers.size > 1) {
    return (
      <BodyShort>
        <Button
          className={styles.linkButton}
          as={NextLink}
          href="#variants-table"
          variant={'tertiary'}
          icon={<ArrowDownIcon aria-hidden />}
          iconPosition={'right'}
        >
          Se tabell med varianter
        </Button>
      </BodyShort>
    )
  }
}

export default ProductTop
