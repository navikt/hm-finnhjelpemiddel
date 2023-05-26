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
  if (!rank) {
    return null
  }

  return (
    <span
      className={classNames(
        'icon-wrapper',
        {
          'icon-wrapper--green': rank === 1,
          'icon-wrapper--grey': rank !== 1,
          'icon-wrapper--small': size === 'small',
        },
        className
      )}
      title="Agreement rank"
    >
      {rank}
    </span>
  )
}

export default AgreementIcon
