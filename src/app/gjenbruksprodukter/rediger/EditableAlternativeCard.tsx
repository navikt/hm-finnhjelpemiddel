import React from 'react'
import { BodyShort, Box, Button, HGrid } from '@navikt/ds-react'
import styles from './EditableAlternativeCard.module.scss'
import { AlternativeProduct } from '@/app/gjenbruksprodukter/alternative-util'
import ProductImage from '@/components/ProductImage'
import { NeutralTag, SuccessTag } from '@/components/Tags'

export const EditableAlternativeCard = ({
  alternativeProduct,
  onDelete,
}: {
  alternativeProduct: AlternativeProduct
  onDelete: () => void
}) => {
  return (
    <HGrid
      columns={'.5fr 3fr .8fr .8fr .8fr'}
      gap={'2'}
      padding={'4'}
      align={'center'}
      className={styles.container}
      width={'10px'}
    >
      <Box paddingInline="2" paddingBlock="2" className={styles.imageWrapper}>
        <ProductImage src={alternativeProduct.imageUri} productTitle={'produktbilde'}></ProductImage>
      </Box>
      <BodyShort>{alternativeProduct.variantTitle}</BodyShort>
      <BodyShort>HMS: {alternativeProduct.hmsArtNr}</BodyShort>
      {alternativeProduct.onAgreement ? (
        <SuccessTag>Rangering {alternativeProduct.highestRank}</SuccessTag>
      ) : (
        <NeutralTag>Ikke på avtale</NeutralTag>
      )}
      <Button variant={'secondary'} onClick={onDelete} className={styles.deleteButton}>
        Slett
      </Button>
    </HGrid>
  )
}
