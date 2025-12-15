import React from 'react'
import { BodyShort, HGrid } from '@navikt/ds-react'
import styles from './EditableAlternativeCard.module.scss'

export const NoAlternativesCard = () => (
  <HGrid
    columns={'1fr'}
    gap={'2'}
    padding={'4'}
    align={'center'}
    className={`${styles.containerDotted} `}
    width={'10px'}
  >
    <BodyShort align={'center'}>Det finnes ingen registrerte alternativer for dette produktet.</BodyShort>
  </HGrid>
)
