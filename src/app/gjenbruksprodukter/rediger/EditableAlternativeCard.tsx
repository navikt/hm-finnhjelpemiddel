import React from 'react'
import { BodyShort, Box, Button, HGrid } from '@navikt/ds-react'
import styles from './EditableAlternativeCard.module.scss'
import { AlternativeProduct } from '@/app/gjenbruksprodukter/alternative-util'
import ProductImage from '@/components/ProductImage'

export const EditableAlternativeCard = ({ alternativeProduct }: { alternativeProduct: AlternativeProduct }) => {
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
      <BodyShort>Rangering: {alternativeProduct.highestRank}</BodyShort>
      <Button variant={'secondary'} style={{ width: 'fit-content' }}>
        Slett
      </Button>
    </HGrid>
  )
}
