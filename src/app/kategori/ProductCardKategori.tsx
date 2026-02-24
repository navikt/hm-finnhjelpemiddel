'use client'

import { AgreementInfo, Product } from '@/utils/product-util'
import { Bleed, BodyShort, Box, HStack, Link, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import ProductImage from '@/components/ProductImage'
import { CompareButton } from '@/app/rammeavtale/hjelpemidler/[agreementId]/CompareButton'
import { NeutralTag, SuccessTag } from '@/components/Tags'
import styles from './ProductCardKategori.module.scss'

export const ProductCardKategori = ({
  product,
  handleCompareClick,
}: {
  product: Product
  handleCompareClick?: () => void
}) => {
  const linkToProduct = `/produkt/${product.id}`

  const minRank = product.agreements && Math.min(...product.agreements.map((agreement) => agreement.rank))
  const onAgreement = minRank !== Infinity

  return (
    <Box padding={{ xs: 'space-8', md: 'space-16' }} className={styles.container} width={{ xs: '100%', sm: '288px' }}>
      <VStack height={'100%'} gap={'space-8'}>
        <VStack>
          <HStack paddingBlock={{ xs: 'space-0', md: 'space-0 space-16' }} align={'center'} justify={'space-between'}>
            {onAgreement ? <SuccessTag>På avtale</SuccessTag> : <NeutralTag>Ikke på avtale</NeutralTag>}
            <CompareButton product={product} handleCompareClick={handleCompareClick} />
          </HStack>

          <Box className={styles.imageWrapper}>
            <ProductImage src={product.photos.at(0)?.uri} productTitle={product.title} />
          </Box>
          <BodyShort size="small" className={styles.secondaryUppercaseText}>
            {product.isoCategoryTitle}
          </BodyShort>
          <VStack gap={'space-4'} paddingBlock={'space-8'}>
            <Link className={styles.link} href={linkToProduct} aria-label={`Gå til ${product.title}`} as={NextLink}>
              <BodyShort weight="semibold">{product.title}</BodyShort>
            </Link>
            <BodyShort size="small">{product.supplierName}</BodyShort>
          </VStack>
        </VStack>
        {onAgreement && <DelkontraktRank agreements={product.agreements} />}
      </VStack>
    </Box>
  )
}

const DelkontraktRank = ({ agreements }: { agreements: AgreementInfo[] }) => {
  if (agreements.length === 0) {
    return <></>
  }

  const minRankAgreement = agreements.sort((a, b) => a.rank - b.rank)[0]

  return (
    <Bleed
      className={styles.delKontrakt}
      marginInline={{ xs: 'space-8', md: 'space-16' }}
      marginBlock={{ xs: 'space-0 space-8', md: 'space-0 space-16' }}
    >
      <VStack
        align={'start'}
        paddingBlock={{ xs: 'space-4 space-8', md: 'space-8 space-16' }}
        paddingInline={{ xs: 'space-8', md: 'space-16' }}
      >
        {agreements.length > 1 ? (
          <BodyShort size="small" className={styles.secondaryUppercaseText}>
            På flere delkontrakter
          </BodyShort>
        ) : (
          <>
            <BodyShort size="small" className={styles.secondaryUppercaseText}>
              Rangering {minRankAgreement.rank}
            </BodyShort>
            <BodyShort size="small" className={styles.secondaryLowercaseText}>
              {minRankAgreement.postTitle}
            </BodyShort>
          </>
        )}
      </VStack>
    </Bleed>
  )
}
