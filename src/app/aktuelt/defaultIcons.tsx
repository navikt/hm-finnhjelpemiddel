import { DocPencilIcon, LightBulbIcon, NewsletterIcon } from '@navikt/aksel-icons'

export const DefaultRammeavtaleIcon = () => {
  return <DocPencilIcon color={'var(--ax-bg-brand-magenta-moderate-pressed)'} />
}

export const DefaultNyhetsbrevIcon = () => {
  return <NewsletterIcon color={'var(--ax-bg-accent-moderate-pressed)'} />
}

export const DefaultNyFunksjonIcon = () => {
  return <LightBulbIcon color={'var(--ax-bg-warning-moderate-hover)'} />
}
