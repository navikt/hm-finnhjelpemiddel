import classNames from 'classnames'
import './definitionlist.scss'

const DefinitionList = ({
  children,
  className,
  fullWidth = false,
}: {
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}) => {
  return (
    <dl className={classNames('definition-list', { 'definition-list--full-width': fullWidth }, className)}>
      {children}
    </dl>
  )
}

const DeflistTerm = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <dt className={className}>{children}</dt>
}

const DeflistDefinition = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <dd className={className}>{children}</dd>
}

DefinitionList.Term = DeflistTerm
DefinitionList.Definition = DeflistDefinition

export default DefinitionList
