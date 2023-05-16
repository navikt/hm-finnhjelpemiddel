import classNames from 'classnames'

const AgreementIcon = ({ number }: { number: number }) => {
  return (
    <div
      className={classNames('icon-wrapper', {
        green: number === 1,
        grey: number !== 1,
      })}
      title="Agreement rank"
    >
      {number}
    </div>
  )
}

export default AgreementIcon
