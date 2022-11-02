import { Heading, Link } from '@navikt/ds-react'

type ProduktProps = {
  artikkelId: string
  artikkelnavn: string
  paaRammeavtale: boolean
}

const Produkt = ({ artikkelId, artikkelnavn, paaRammeavtale }: ProduktProps) => {
  return (
    <li>
      <article key="artikkelId">
        <Heading level="3" size="xsmall">
          {artikkelnavn}
        </Heading>
        <Link href={`/artikler/${artikkelId}`}>{artikkelnavn}</Link>
      </article>
    </li>
  )
}

export default Produkt
