import { LinkPanel } from '@navikt/ds-react'
import { Product } from '../utils/product-util'

type ProduktProps = {
  produkt: Product
  paaRammeavtale: boolean
}

const Produkt = ({ produkt }: ProduktProps) => {
  return (
    <li>
      <LinkPanel className="product" href={`/produkt/${produkt.id}`} border>
        <LinkPanel.Title>{produkt.title}</LinkPanel.Title>
        <LinkPanel.Description className="product__description">{produkt.description?.short}</LinkPanel.Description>
      </LinkPanel>
    </li>
  )
}

export default Produkt
