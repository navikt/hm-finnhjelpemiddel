import classNames from 'classnames'

const AgreementIcon = ({
  rank,
  className,
  size = 'medium',
}: {
  rank: number
  className?: string
  size?: 'small' | 'medium'
}) => {
  const isGreen = rank === 1 || rank === 99

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
      {rank === 99 ? '-' : rank}
    </span>
  )
}

export default AgreementIcon
