'use client'
import { Produkt as Product } from '../../../utils/produkt-util'
import { Back, Next } from '@navikt/ds-icons'
import { Heading } from '@navikt/ds-react/esm/typography'
import { useState } from 'react'
import './produkt.scss'
import ComparingTable, { TableRows } from './ComparingTable'

const mapDict = (products: Product[]): TableRows => {
  let obj: TableRows = {}

  products.forEach((product) => {
    product.tekniskData.forEach(({ key, value, unit }) => {
      if (key in obj) {
        obj[key][product.id] = [value, unit]
      } else {
        obj[key] = { [product.id]: [value, unit] }
      }
    })
  })

  return obj
}

type SimilarProductsProps = {
  mainProduct: Product
  seriesProducts: Product[]
}

const SimilarProducts = ({ mainProduct, seriesProducts }: SimilarProductsProps) => {
  const numberOfProducts = seriesProducts.length
  const range = numberOfProducts >= 4 ? 4 : numberOfProducts
  let [firstActive, setFirstActive] = useState(0)

  const prevProduct = () => {
    const prevIndex = firstActive !== 0 ? firstActive - 1 : 0
    setFirstActive(prevIndex)
  }

  const nextProduct = () => {
    const nextIndex = firstActive !== numberOfProducts - 1 ? firstActive + 1 : 0
    setFirstActive(nextIndex)
  }

  const allProducts = [mainProduct, ...seriesProducts]

  const tableHeaders = [{ id: 'key', label: 'Egenskap' }].concat(
    allProducts.map((product) => ({ id: String(product.id), label: 'Produkt ' + product.id }))
  )

  // Det er ikke data med flere bilder enda, så venter med å sjule chevron ol før det skjer
  return (
    <>
      <Heading level="3" size="medium">
        Produkter i produktserie
      </Heading>
      <div className="similar-products__slider">
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
        <div className="similar-products__cards">
          {[...Array(range).keys()].map((index) => {
            const product = seriesProducts[firstActive + index]
            return (
              <div key={index} className="similar-products__card">
                <p>{product.tittel}</p>
                <p>{product.description?.name}</p>
                <a href={`/produkt/${product.id}`}>Les mer</a>
              </div>
            )
          })}
        </div>
        {numberOfProducts - (firstActive + range) > 0 && (
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
      <Heading level="3" size="medium">
        Sammenlikn teknisk data med andre produkter i produkserien
      </Heading>
      <div className="comparing-table ">
        <ComparingTable rows={mapDict(allProducts)} headers={tableHeaders} />
      </div>
    </>
  )
}

export default SimilarProducts
