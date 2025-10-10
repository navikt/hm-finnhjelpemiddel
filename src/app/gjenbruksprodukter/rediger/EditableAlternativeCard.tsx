import React from 'react'
import { Stack } from '@navikt/ds-react'
import styles from '@/app/gjenbruksprodukter/AlternativeProducts.module.scss'
import { AlternativeProduct } from '@/app/gjenbruksprodukter/alternative-util'

export const EditableAlternativeCard = ({ alternativeProduct }: { alternativeProduct: AlternativeProduct }) => {
  return (
    <Stack align={'start'} direction={'column'} className={styles.alternativeProductContainer}>
      {alternativeProduct.hmsArtNr}
    </Stack>
  )
}
