'use client'
import { Produkt as Product } from '../../../utils/produkt-util'
import { Back, Next } from '@navikt/ds-icons'
import { useState } from 'react'
import './produkt.scss'

type SimilarProductsProps = {
  products: Product[]
}

const SimilarProducts = ({ products }: SimilarProductsProps) => {
  const numberOfProducts = products.length
  const range = numberOfProducts >= 4 ? 4 : numberOfProducts
  let [firstActive, setActive] = useState(0)

  const prevProduct = () => {
    const prevIndex = firstActive !== 0 ? firstActive - 1 : 0
    setActive(prevIndex)
  }

  const nextProduct = () => {
    const nextIndex = firstActive !== numberOfProducts - 1 ? firstActive + 1 : 0
    setActive(nextIndex)
  }

  console.log('productsssss', products)

  // Det er ikke data med flere bilder enda, så venter med å sjule chevron ol før det skjer
  return (
    <div className="similar-products-slider">
      {firstActive > 0 && (
        <div
          className="back"
          onClick={() => {
            prevProduct()
          }}
        >
          <Back height={30} width={30} />
        </div>
      )}
      <div className="similar-products-container">
        {[...Array(range).keys()].map((index) => {
          const asd = products[firstActive + index]
          return (
            <div key={index} className="similar-product">
              <p>{asd.tittel}</p>
              <p>{asd.description?.name}</p>
              <a href={`/produkt/${asd.id}`}>Les mer</a>
            </div>
          )
        })}
      </div>
      {numberOfProducts > 4 && (
        <div
          className="arrow"
          onClick={() => {
            nextProduct()
          }}
        >
          <Next height={30} width={30} />
        </div>
      )}
    </div>
  )
}

export default SimilarProducts
