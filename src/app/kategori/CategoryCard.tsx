'use client'

import { LinkCard, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import styles from './CategoryCard.module.scss'
import Image from 'next/image'

type Props = {
  title: string
  link: string
  description?: string
  icon?: string
  showSubCategoryIcons?: boolean
}

export const CategoryCard = ({ title, link, description, icon, showSubCategoryIcons }: Props) => {
  const showIcon = (showSubCategoryIcons === undefined || showSubCategoryIcons) && icon !== undefined
  return (
    <LinkCard arrow={true} className={styles.container}>
      {showIcon && (
        <VStack justify="center" height="100%" asChild>
          <LinkCard.Icon>
            {
              <Image
                width={30}
                height={30}
                alt={'ikon'}
                src={`data:image/svg+xml;utf8,${encodeURIComponent(icon)}`}
                draggable={false}
                className={styles.iconImage}
              />
            }
          </LinkCard.Icon>
        </VStack>
      )}
      <LinkCard.Title>
        <LinkCard.Anchor asChild>
          <NextLink href={link}>{title}</NextLink>
        </LinkCard.Anchor>
      </LinkCard.Title>
    </LinkCard>
  )
}
