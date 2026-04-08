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
    <LinkCard arrow={false} data-color={'accent'} className={styles.container}>
      {showIcon && (
        <LinkCard.Image aspectRatio={'16/9'}>
          {
            <Image
              fill
              alt={'ikon'}
              src={`data:image/svg+xml;utf8,${encodeURIComponent(icon)}`}
              draggable={false}
              className={styles.iconImage}
            />
          }
        </LinkCard.Image>
      )}
      <LinkCard.Title>
        <LinkCard.Anchor asChild>
          <NextLink href={link} className={styles.linkText}>
            {title}
          </NextLink>
        </LinkCard.Anchor>
      </LinkCard.Title>
      <LinkCard.Description>{description}</LinkCard.Description>
    </LinkCard>
  )
}
