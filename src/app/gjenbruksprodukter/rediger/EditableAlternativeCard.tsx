import React from 'react'
import { BodyShort, Box, Button, HGrid, Link, VStack } from '@navikt/ds-react'
import styles from './EditableAlternativeCard.module.scss'
import { AlternativeProduct } from '@/app/gjenbruksprodukter/alternative-util'
import ProductImage from '@/components/ProductImage'
import { NeutralTag, SuccessTag } from '@/components/Tags'
import NextLink from 'next/link'

export const EditableAlternativeCard = ({
  alternativeProduct,
  onDelete,
  isOriginal,
}: {
  alternativeProduct: AlternativeProduct
  onDelete: () => void
  isOriginal?: boolean
}) => {
  return (
    <HGrid
      columns={'.5fr 3fr .8fr .8fr .8fr'}
      gap={'2'}
      padding={'4'}
      align={'center'}
      className={`${styles.container} ${isOriginal ? styles.original : ''}`}
      width={'10px'}
    >
      <Box paddingInline="2" paddingBlock="2" className={styles.imageWrapper}>
        <ProductImage src={alternativeProduct.imageUri} productTitle={'produktbilde'}></ProductImage>
      </Box>
      <VStack>
        <Link
          as={NextLink}
          href={`/produkt/${alternativeProduct.seriesId}?term=${alternativeProduct.hmsArtNr}`}
          className={styles.link}
        >
          {alternativeProduct.seriesTitle}
        </Link>
        <BodyShort>{alternativeProduct.variantTitle}</BodyShort>
      </VStack>
      <BodyShort>HMS: {alternativeProduct.hmsArtNr}</BodyShort>
      {alternativeProduct.onAgreement ? (
        <SuccessTag>{`Rangering ${alternativeProduct.highestRank}`}</SuccessTag>
      ) : (
        <NeutralTag>Ikke på avtale</NeutralTag>
      )}
      {isOriginal ? (
        <></>
      ) : (
        <Button variant={'secondary'} onClick={onDelete} className={styles.deleteButton}>
          Slett
        </Button>
        )
      }

    </HGrid>
  )
}
