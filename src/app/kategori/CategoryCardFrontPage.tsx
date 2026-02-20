'use client'

import { Box, LinkCard } from '@navikt/ds-react'
import NextLink from 'next/link'
import styles from './CategoryCard.module.scss'
import { ReactNode } from 'react'
import { ArrowRightIcon } from '@navikt/aksel-icons'

type Props = {
  title: string
  link: string
  description?: string
  icon?: ReactNode | undefined
}

export const CategoryCardFrontPage = ({ title, link, description, icon }: Props) => {
  return (
    <LinkCard arrow={false} className={styles.topCardContainer}>
      {icon && <LinkCard.Icon>{icon}</LinkCard.Icon>}
      <Box className={styles.bottomSection}>
        <LinkCard.Title as="h3">
          <LinkCard.Anchor asChild>
            <NextLink href={link}>{title}</NextLink>
          </LinkCard.Anchor>
        </LinkCard.Title>
        <ArrowRightIcon className={styles.arrowIcon} />
      </Box>
    </LinkCard>
  )
}
