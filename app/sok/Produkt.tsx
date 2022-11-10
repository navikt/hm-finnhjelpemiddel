import { BodyShort, Heading, Link } from '@navikt/ds-react'
import { Produkt } from '../../utils/productType'

type ProduktProps = {
  produkt: Produkt
  paaRammeavtale: boolean
}

const Produkt = ({ produkt }: ProduktProps) => {
  return (
    <li>
      <article key="produkt-kompakt">
        <Heading level="3" size="xsmall">
          {produkt?.tittel}
        </Heading>
        <Link href={`/artikler/${produkt.id}`}>Les mer</Link>
        <BodyShort>{produkt?.modell?.hmm}</BodyShort>
      </article>
    </li>
  )
}

export default Produkt
