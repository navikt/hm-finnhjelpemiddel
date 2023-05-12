const AgreementIcon = ({ number }: { number: number }) => {
  const color = number === 1 ? 'green' : 'grey'
  return (
    <div className={'icon-wrapper ' + color} title="Agreement rank">
      {number}
    </div>
  )
}

export default AgreementIcon
