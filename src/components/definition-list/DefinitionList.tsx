import classNames from 'classnames'
import styles from './DefinitionList.module.scss'

const DefinitionList = ({
  children,
  className,
  fullWidth = false,
  horizontal = false,
}: {
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
  horizontal?: boolean
}) => {
  return (
    <dl
      className={classNames(
        styles.definitionList,
        { [styles.definitionListFullWidth]: fullWidth },
        { [styles.definitionListHorizontal]: horizontal },
        className
      )}
    >
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
