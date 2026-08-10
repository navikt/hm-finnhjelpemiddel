'use client'

import { ReactNode } from 'react'

import NextLink from 'next/link'

import { LinkCard } from '@navikt/ds-react'

import styles from './CategoryCardFrontPage.module.scss'

type Props = {
  title: string
  link: string
  description?: string
  icon?: ReactNode | undefined
}

export const CategoryCardFrontPage = ({ title, link, icon }: Props) => {
  return (
    <LinkCard arrow={true} className={styles.container}>
      {icon && <LinkCard.Icon>{icon}</LinkCard.Icon>}
      <LinkCard.Title style={{ textWrap: 'balance' }}>
        <LinkCard.Anchor asChild>
          <NextLink href={link} style={{ textDecoration: 'none' }}>
            {title}
          </NextLink>
        </LinkCard.Anchor>
      </LinkCard.Title>
    </LinkCard>
  )
}
