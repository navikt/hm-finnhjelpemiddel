import './definitionlist.scss'

const DefinitionList = ({ children }: { children: React.ReactNode }) => {
  return <dl className="definition-list">{children}</dl>
}

const DeflistTerm = ({ term }: { term: string }) => {
  return <dt className="definition-list--item">{term}</dt>
}

const DeflistDefinition = ({ definition }: { definition: string }) => {
  return <dd className="definition-list--definition">{definition}</dd>
}

DefinitionList.Term = DeflistTerm
DefinitionList.Definition = DeflistDefinition

export default DefinitionList
