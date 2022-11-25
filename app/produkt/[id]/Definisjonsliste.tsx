import './definisjonsliste.scss'

const Definisjonsliste = ({ children }: { children: React.ReactNode }) => {
  return <dl className="definition-list">{children}</dl>
}

const DeflisteTerm = ({ term }: { term: string }) => {
  return <dt className="definition-list--item">{term}</dt>
}

const DeflisteDefinition = ({ definition }: { definition: string }) => {
  return <dd className="definition-list--definition">{definition}</dd>
}

Definisjonsliste.Term = DeflisteTerm
Definisjonsliste.Definition = DeflisteDefinition

export default Definisjonsliste
