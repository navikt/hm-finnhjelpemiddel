import { Product as Product } from '../../utils/product-util'
import { Back, Next } from '@navikt/ds-icons'
import { Table, SortState, Heading } from '@navikt/ds-react'
import { useEffect, useRef, useState } from 'react'
import { sortAlphabetically } from '../../utils/sort-util'

type SimilarProductsProps = {
  mainProduct: Product
  seriesProducts: Product[]
}

const SimilarProducts = ({ mainProduct, seriesProducts }: SimilarProductsProps) => {
  const ref = useRef(null)
  const [keyColumnWidth, setKeyColumnWidth] = useState(0)
  const [sort, setSort] = useState<SortState | undefined>(undefined)

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
  const allDataKeys = allProducts
    .flatMap((prod) => Object.keys(prod.techData))
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((keyA, keyB) => {
      if (sort) {
        return sortAlphabetically(keyA, keyB, sort?.direction === 'descending')
      }
      return 1
    })

  const handleSort = (sortKey: string | undefined) => {
    if (sortKey) {
      setSort(
        sortKey === sort?.orderBy && sort?.direction === 'descending'
          ? undefined
          : {
              orderBy: sortKey,
              direction: sortKey === sort?.orderBy && sort?.direction === 'ascending' ? 'descending' : 'ascending',
            }
      )
    } else setSort(undefined)
  }

  useEffect(() => {
    setKeyColumnWidth(ref.current ? ref.current['offsetWidth'] : 0)
  }, [])

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
                <p>{product.title}</p>
                <p>{product.attributes?.articlename}</p>
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
        Sammenlign teknisk data med andre produkter i produkserien
      </Heading>
      <div className="comparing-table comparing-table__two-sticky-columns">
        <Table sort={sort} onSortChange={(sortKey) => handleSort(sortKey)}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader scope="col" sortKey="name" ref={ref} sortable>
                <Heading level="4" size="medium" spacing>
                  Egenskaper
                </Heading>
              </Table.ColumnHeader>
              <Table.ColumnHeader style={{ left: keyColumnWidth }}>{'Produkt ' + mainProduct.id}</Table.ColumnHeader>
              {seriesProducts.length > 0 &&
                seriesProducts.map((product, i) => (
                  <Table.ColumnHeader key={'id-' + product.id} style={{ height: '5px' }}>
                    {'Produkt ' + product.id}
                  </Table.ColumnHeader>
                ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {seriesProducts.length > 0 &&
              allDataKeys.map((key) => (
                <Table.Row key={key + 'row'}>
                  <Table.HeaderCell>{key}</Table.HeaderCell>
                  <Table.DataCell style={{ left: keyColumnWidth > 0 ? keyColumnWidth : 'auto' }}>
                    {mainProduct.techData?.[key].value + mainProduct.techData?.[key].unit}
                  </Table.DataCell>
                  {seriesProducts.map((product) => (
                    <Table.DataCell key={key + '-' + product.id}>
                      {product.techData[key] !== undefined
                        ? product.techData[key].value + product.techData[key].unit
                        : '-'}
                    </Table.DataCell>
                  ))}
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
    </>
  )
}

export default SimilarProducts