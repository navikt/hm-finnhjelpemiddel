import { Tag } from '@navikt/ds-react'

type Props = {
  title?: string
  children: React.ReactNode
  className?: string
}

export const SuccessTag = ({ title, children, className }: Props) => {
  return (
    <Tag variant={'success'} size={'small'} style={{ borderRadius: '0.3rem' }} title={title} className={className}>
      {children}
    </Tag>
  )
}

export const NeutralTag = ({ title, children, className }: Props) => {
  return (
    <Tag variant={'neutral'} size={'small'} style={{ borderRadius: '0.3rem' }} title={title}>
      {' '}
      {children}
    </Tag>
  )
}
