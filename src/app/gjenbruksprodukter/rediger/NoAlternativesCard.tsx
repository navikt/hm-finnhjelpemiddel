import React from 'react'
import { BodyShort, Box, Button, HGrid, Link, VStack } from '@navikt/ds-react'
import styles from './EditableAlternativeCard.module.scss'
import { AlternativeProduct } from '@/app/gjenbruksprodukter/alternative-util'
import ProductImage from '@/components/ProductImage'
import { NeutralTag, SuccessTag } from '@/components/Tags'
import NextLink from 'next/link'

export const NoAlternativesCard = ({}: {}) => {
  return (
    <HGrid
      columns={'1fr'}
      gap={'2'}
      padding={'4'}
      align={'center'}
      className={`${styles.containerDotted} `}
      width={'10px'}
    >
      <BodyShort align={'center'}>
        Det finnes ingen registrerte alternativer for dette produktet.
      </BodyShort>
    </HGrid>
  )
}
