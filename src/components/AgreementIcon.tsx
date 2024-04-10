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
  // const isGreen = rank === 1 || rank === 99
  const label =
    rank === 99 ? (size === 'small' ? '-' : 'På avtale uten rangering') : size === 'small' ? rank : `Rangering ${rank}`
  return (
    <span
      className={classNames(
        'agreement-wrapper',
        {
          'agreement-wrapper--green': true,
          // 'agreement-wrapper--grey': !isGreen,
          'agreement-wrapper--small': size === 'small',
        },
        className
      )}
      title="Rangering"
    >
      {label}
    </span>
  )
}

export default AgreementIcon
