import { LinkPanel } from '@navikt/ds-react'
import { Produkt } from '../../utils/productType'

type ProduktProps = {
  produkt: Produkt
  paaRammeavtale: boolean
}

const Produkt = ({ produkt }: ProduktProps) => {
  return (
    <li>
      <LinkPanel style={{ marginBottom: 16 }} href="`/produkt/${produkt.id}" border>
        <LinkPanel.Title>{produkt.tittel}</LinkPanel.Title>
        <LinkPanel.Description>{produkt.modell?.beskrivelse}</LinkPanel.Description>
      </LinkPanel>
    </li>
  )
}

export default Produkt
