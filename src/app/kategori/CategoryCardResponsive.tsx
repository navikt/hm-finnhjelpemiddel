'use client'

import Image from 'next/image'
import NextLink from 'next/link'

import { LinkCard } from '@navikt/ds-react'

import styles from './CategoryCardResponsive.module.scss'

type Props = {
  title: string
  link: string
  description?: string
  icon?: string
  showSubCategoryIcons?: boolean
}

export const CategoryCardResponsive = ({ title, link, description, icon, showSubCategoryIcons }: Props) => {
  const showIcon = (showSubCategoryIcons === undefined || showSubCategoryIcons) && icon !== undefined
  return (
    <LinkCard arrow={false} data-color={'accent'} className={styles.container}>
      {showIcon && (
        <LinkCard.Image aspectRatio={'16/9'} className={styles.imageContainer}>
          <Image
            width={100}
            height={500}
            alt={'Ikon for ' + title}
            aria-hidden={true}
            src={`data:image/svg+xml;utf8,${encodeURIComponent(icon)}`}
            draggable={false}
            className={styles.iconImage}
          />
        </LinkCard.Image>
      )}
      <LinkCard.Title style={{ textWrap: 'balance' }}>
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
