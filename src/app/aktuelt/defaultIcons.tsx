import { DocPencilIcon, LightBulbIcon, NewsletterIcon } from '@navikt/aksel-icons'

export const DefaultRammeavtaleIcon = () => {
  return <DocPencilIcon fontSize={'63px'} color={'var(--ax-bg-brand-magenta-moderate-pressed)'} />
}

export const DefaultNyhetsbrevIcon = () => {
  return <NewsletterIcon fontSize={'63px'} color={'var(--ax-bg-accent-moderate-pressed)'} />
}

export const DefaultNyFunksjonIcon = () => {
  return <LightBulbIcon fontSize={'63px'} color={'var(--ax-bg-warning-moderate-hover)'} />
}
