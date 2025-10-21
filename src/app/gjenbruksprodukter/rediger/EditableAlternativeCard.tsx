import React from 'react'
import { BodyShort, Box, Button, HGrid, Tag } from '@navikt/ds-react'
import styles from './EditableAlternativeCard.module.scss'
import { AlternativeProduct } from '@/app/gjenbruksprodukter/alternative-util'
import ProductImage from '@/components/ProductImage'

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
      <BodyShort>
        <Box paddingInline="2" paddingBlock="2" className={styles.imageWrapper}>
          <ProductImage src={alternativeProduct.imageUri} productTitle={'produktbilde'}></ProductImage>
        </Box>
      </BodyShort>
      <BodyShort>{alternativeProduct.variantTitle}</BodyShort>
      <BodyShort>HMS: {alternativeProduct.hmsArtNr}</BodyShort>
      <Tag variant={'success-moderate'} className={styles.agreementTag}>
        {alternativeProduct.highestRank === 99 ? 'På avtale' : `Rangering ${alternativeProduct.highestRank}`}
      </Tag>
      <Button variant={'secondary'} onClick={onDelete} className={styles.deleteButton}>
        Slett
      </Button>
    </HGrid>
  )
}
