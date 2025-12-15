import { Tag } from '@navikt/ds-react'

type Props = {
  title?: string
  children: React.ReactNode
  className?: string
}

export const SuccessTag = ({ title, children, className }: Props) => {
  return (
    <Tag
      variant={'success-moderate'}
      size={'small'}
      style={{ borderRadius: '0.25rem', backgroundColor: '#CCF1D6' }}
      title={title}
      className={className}
    >
      {children}
    </Tag>
  )
}

export const NeutralTag = ({ title, children }: Props) => {
  return (
    <Tag
      variant={'neutral-moderate'}
      size={'small'}
      style={{ borderRadius: '0.25rem', backgroundColor: '#F0ECF4' }}
      title={title}
    >
      {' '}
      {children}
    </Tag>
  )
}
