import { LinkPanel } from '@navikt/ds-react'
import { Produkt } from '../utils/produkt-util'

type ProduktProps = {
  produkt: Produkt
  paaRammeavtale: boolean
}

const Produkt = ({ produkt }: ProduktProps) => {
  return (
    <li>
      <LinkPanel className="product" href={`/produkt/${produkt.id}`} border>
        <LinkPanel.Title>{produkt.tittel}</LinkPanel.Title>
        <LinkPanel.Description className="product__description">
          {produkt.description?.beskrivelse}
        </LinkPanel.Description>
      </LinkPanel>
    </li>
  )
}

export default Produkt
