'use client'
import { Produkt as Product } from '../../../utils/produkt-util'
import { Back, Next } from '@navikt/ds-icons'
import { useState } from 'react'
import './produkt.scss'
import ComparingTable, { TableRows } from './ComparingTable'

const lagDict = (products: Product[]): TableRows => {
  let obj: TableRows = {}

  products.forEach((product) => {
    product.tekniskData.forEach(({ key, value }) => {
      if (key in obj) {
        obj[key][product.id] = value
      } else {
        obj[key] = { [product.id]: value }
      }
    })
  })

  return obj
}

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

  const tableHeaders = [{ id: 'key', label: 'Def' }].concat(
    products.map((product) => ({ id: String(product.id), label: 'Produkt ' + product.id }))
  )

  // Det er ikke data med flere bilder enda, så venter med å sjule chevron ol før det skjer
  return (
    <>
      <h3 className="navds-heading navds-heading--medium">Produkter i produktserie</h3>
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
            const asd = products[firstActive + index]
            return (
              <div key={index} className="similar-products__card">
                <p>{asd.tittel}</p>
                <p>{asd.description?.name}</p>
                <a href={`/produkt/${asd.id}`}>Les mer</a>
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
      <h3 className="navds-heading navds-heading--medium">
        Sammenlikn teknisk data med andre produkter i produkserien
      </h3>
      <div className="comparing-table ">
        <ComparingTable rows={lagDict(products)} headers={tableHeaders} />
      </div>
    </>
  )
}

export default SimilarProducts
