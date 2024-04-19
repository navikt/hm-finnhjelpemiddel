import { AgreementInfo } from '@/utils/product-util'
import classNames from 'classnames'

export const viewAgreementRanks = (agreements: AgreementInfo[]) => {
  const ranks = new Set(agreements.map((agr) => agr.rank))
  if (agreements.length === 0) return <>-</>
  if (ranks.size === 1 && ranks.has(99)) return <AgreementIcon rank={99} text={'Urangert'} />
  if (ranks.size === 1) return <AgreementIcon size="small" rank={agreements[0].rank} />

  return (
    <AgreementIcon
      rank={99}
      text={agreements
        .map((ag) => ag.rank)
        .filter((rank) => rank !== 99)
        .sort()
        .join(', ')}
    />
  )
}

const AgreementIcon = ({
  rank,
  text,
  className,
  size = 'medium',
}: {
  rank: number
  text?: string
  className?: string
  size?: 'xsmall' | 'small' | 'medium'
}) => {
  const onlyRankNumber = size === 'xsmall' || size === 'small'
  const label =
    text || (rank === 99 ? (onlyRankNumber ? '-' : 'På avtale') : onlyRankNumber ? rank : `Rangering ${rank}`)
  return (
    <span
      className={classNames(
        'agreement-wrapper',
        {
          'agreement-wrapper--green': true,
          'agreement-wrapper--small': size === 'small',
          'agreement-wrapper--xsmall': size === 'xsmall',
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
