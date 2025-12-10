'use client'

import { LinkCard, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import { ReactNode } from 'react'

type Props = {
  title: string
  link: string
  description?: string
  icon?: ReactNode | undefined
}

export const CategoryCard = ({ title, link, description, icon }: Props) => {
  return (
    <LinkCard arrow={false} style={{ boxShadow: 'var(--a-shadow-medium)' }}>
      {icon && (
        <VStack justify="center" height="100%" asChild>
          <LinkCard.Icon>{icon}</LinkCard.Icon>
        </VStack>
      )}
      <LinkCard.Title>
        <LinkCard.Anchor asChild>
          <NextLink href={link}>{title}</NextLink>
        </LinkCard.Anchor>
      </LinkCard.Title>
      {description && <LinkCard.Description>{description}</LinkCard.Description>}
    </LinkCard>
  )
}
