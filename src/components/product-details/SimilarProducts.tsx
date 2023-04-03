import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Back, Next } from '@navikt/ds-icons'
import { Table, SortState, Heading, Button } from '@navikt/ds-react'
import { Product } from '../../utils/product-util'
import { sortAlphabetically } from '../../utils/sort-util'

type SimilarProductsProps = {
  mainProduct: Product
  seriesProducts: Product[]
}

const SimilarProducts = ({ mainProduct, seriesProducts }: SimilarProductsProps) => {
  const [keyColumnWidth, setKeyColumnWidth] = useState(0)
  const [sort, setSort] = useState<SortState | undefined>(undefined)
  const colHeadRef = useRef(null)

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

  const rows: { [key: string]: string[] } = Object.assign(
    {},
    ...allDataKeys.map((key) => ({
      [key]: allProducts.map((product) =>
        product.techData[key] !== undefined ? product.techData[key].value + product.techData[key].unit : '-'
      ),
    }))
  )

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
    setKeyColumnWidth(colHeadRef.current ? colHeadRef.current['offsetWidth'] : 0)
  }, [colHeadRef, keyColumnWidth])

  const hasDifferentValues = ({ row }: { row: string[] }) => {
    let uniqueValues = new Set(row)
    uniqueValues.delete('-')
    return uniqueValues.size > 1
  }

  return (
    <>
      <Heading level="3" size="medium">
        Produkter i produktserie
      </Heading>
      <div className="similar-products__slider">
        {firstActive > 0 && (
          <Button
            variant="tertiary-neutral"
            className="arrow"
            onClick={() => {
              prevProduct()
            }}
            icon={<Back height={30} width={30} />}
          />
        )}
        <div className="similar-products__cards">
          {[...Array(range).keys()].map((index) => {
            const product = seriesProducts[firstActive + index]
            return (
              <div key={index} className="similar-products__card">
                <p>{product.title}</p>
                <p>{product.attributes?.articlename}</p>
                <Link href={`/produkt/${product.id}`}>Les mer</Link>
              </div>
            )
          })}
        </div>
        {numberOfProducts - (firstActive + range) > 0 && (
          <Button
            variant="tertiary-neutral"
            className="arrow"
            onClick={() => {
              nextProduct()
            }}
            icon={<Next height={30} width={30} />}
          />
        )}
      </div>
      <Heading level="3" size="medium">
        Sammenlign teknisk data med andre produkter i produkserien
      </Heading>
      <div className="comparing-table comparing-table__two-sticky-columns">
        <Table sort={sort} onSortChange={(sortKey) => handleSort(sortKey)}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader scope="col" sortKey="name" ref={colHeadRef} sortable>
                Egenskaper
              </Table.ColumnHeader>
              <Table.ColumnHeader style={{ left: keyColumnWidth > 0 ? keyColumnWidth : 'auto' }}>
                Dette produktet
              </Table.ColumnHeader>
              {seriesProducts.length > 0 &&
                seriesProducts.map((product, i) => (
                  <Table.ColumnHeader key={'id-' + product.id} style={{ height: '5px' }}>
                    <Link href={`/produkt/${product.id}`}>{'Produkt ' + (i + 1)}</Link>
                  </Table.ColumnHeader>
                ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row key={'hms-row'}>
              <Table.HeaderCell>HMS-artnr.</Table.HeaderCell>
              <Table.DataCell style={{ left: keyColumnWidth > 0 ? keyColumnWidth : 'auto' }}>
                {mainProduct.hmsArtNr !== undefined ? mainProduct.hmsArtNr : '-'}
              </Table.DataCell>
              {seriesProducts.map((product) => (
                <Table.DataCell key={'Hms-' + product.id}>
                  {product.hmsArtNr !== undefined ? product.hmsArtNr : '-'}
                </Table.DataCell>
              ))}
            </Table.Row>
            {seriesProducts.length > 0 &&
              Object.entries(rows).map(([key, row]) => (
                <Table.Row key={key + 'row'} className={hasDifferentValues({ row }) ? 'highlight' : ''}>
                  <Table.HeaderCell>{key}</Table.HeaderCell>
                  {row.map((value, i) => (
                    <Table.DataCell key={key + '-' + i}>{value}</Table.DataCell>
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
