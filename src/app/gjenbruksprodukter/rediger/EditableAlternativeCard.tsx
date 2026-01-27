import React from 'react'
import { BodyShort, Box, Button, CopyButton, HGrid, HStack, Link, VStack } from '@navikt/ds-react'
import styles from './EditableAlternativeCard.module.scss'
import { AlternativeProduct } from '@/app/gjenbruksprodukter/alternative-util'
import ProductImage from '@/components/ProductImage'
import { NeutralTag, SuccessTag } from '@/components/Tags'
import NextLink from 'next/link'
import { ThumbUpIcon } from '@navikt/aksel-icons'

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
      gap={"space-8"}
      padding={"space-16"}
      align={'center'}
      className={`${styles.container} ${isOriginal ? styles.original : ''}`}
      width={'10px'}
    >
      <Box paddingInline="space-8" paddingBlock="space-8" className={styles.imageWrapper}>
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
      <HStack align="center" gap="space-8">
        HMS-nummer
        <CopyButton
          size="small"
          copyText={alternativeProduct.hmsArtNr ?? ''}
          text={alternativeProduct.hmsArtNr ?? ''}
          activeText="Kopiert"
          variant="action"
          activeIcon={<ThumbUpIcon aria-hidden />}
          iconPosition="right"
          className={styles.copyButton}
        />
      </HStack>
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
      )}
    </HGrid>
  );
}
