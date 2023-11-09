import classNames from 'classnames'

const AgreementIcon = ({
  rank,
  className,
  size = 'medium',
}: {
  rank: number | null
  className?: string
  size?: 'small' | 'medium'
}) => {
  const isGreen = rank === 1 || rank === null

  return (
    <span
      className={classNames(
        'icon-wrapper',
        {
          'icon-wrapper--green': isGreen,
          'icon-wrapper--grey': !isGreen,
          'icon-wrapper--small': size === 'small',
        },
        className
      )}
      title="Agreement rank"
    >
      {rank === null ? '-' : rank}
    </span>
  )
}

export default AgreementIcon
