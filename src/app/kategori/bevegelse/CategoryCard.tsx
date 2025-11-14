'use client'

import { LinkCard, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'

type Props = {
  icon: React.ReactNode
  title: string
  link: string
  description: string
}

export const CategoryCard = ({ icon, title, link, description }: Props) => {
  return (
    <LinkCard arrow={false}>
      <VStack justify="center" height="100%" asChild>
        <LinkCard.Icon>{icon}</LinkCard.Icon>
      </VStack>
      <LinkCard.Title>
        <LinkCard.Anchor asChild>
          <NextLink href={link} scroll={false}>
            {title}
          </NextLink>
        </LinkCard.Anchor>
      </LinkCard.Title>
      <LinkCard.Description>{description}</LinkCard.Description>
    </LinkCard>
  )
}
