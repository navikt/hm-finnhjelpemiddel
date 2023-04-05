import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowsUpDownIcon, ArrowUpIcon, ArrowDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons'
import { Table, SortState, Heading, Button } from '@navikt/ds-react'
import { Product } from '../../utils/product-util'
import { sortAlphabetically, sortIntWithStringFallback } from '../../utils/sort-util'

type SimilarProductsProps = {
  mainProduct: Product
  seriesProducts: Product[]
}

type SortColumns = {
  orderBy: string
  direction: 'ascending' | 'descending'
}

const SimilarProducts = ({ mainProduct, seriesProducts }: SimilarProductsProps) => {
  const [keyColumnWidth, setKeyColumnWidth] = useState(0)
  const [sortRows, setSortRows] = useState<SortState | undefined>(undefined)
  const [sortColumns, setSortColumns] = useState<SortColumns | undefined>(undefined)
  const colHeadRef = useRef(null)

  useEffect(() => {
    setKeyColumnWidth(colHeadRef.current ? colHeadRef.current['offsetWidth'] : 0)
  }, [colHeadRef, keyColumnWidth])

  const sortColumnsByRowKey = (products: Product[]) => {
    return products.sort((productA, productB) => {
      if (sortColumns?.orderBy == 'HMS') {
        if (productA.hmsArtNr && productB.hmsArtNr) {
          return sortIntWithStringFallback(
            productA.hmsArtNr,
            productB.hmsArtNr,
            sortColumns?.direction === 'descending'
          )
        }
        return -1
      }
      if (
        sortColumns?.orderBy &&
        productA.techData[sortColumns?.orderBy].value &&
        productB.techData[sortColumns?.orderBy].value
      ) {
        return sortIntWithStringFallback(
          productA.techData[sortColumns?.orderBy].value,
          productB.techData[sortColumns?.orderBy].value,
          sortColumns?.direction === 'descending'
        )
      } else return -1
    })
  }

  let sortedByKey = sortColumnsByRowKey(seriesProducts)
  const allProducts = [mainProduct, ...sortedByKey]
  const allDataKeys = allProducts
    .flatMap((prod) => Object.keys(prod.techData))
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((keyA, keyB) => {
      if (sortRows) {
        return sortAlphabetically(keyA, keyB, sortRows?.direction === 'descending')
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

  const hasDifferentValues = ({ row }: { row: string[] }) => {
    let uniqueValues = new Set(row)
    uniqueValues.delete('-')
    return uniqueValues.size > 1
  }

  const handleSortColumn = (sortKey: string | undefined) => {
    if (sortKey) {
      setSortRows(
        sortKey === sortRows?.orderBy && sortRows?.direction === 'descending'
          ? undefined
          : {
              orderBy: sortKey,
              direction:
                sortKey === sortRows?.orderBy && sortRows?.direction === 'ascending' ? 'descending' : 'ascending',
            }
      )
    } else setSortRows(undefined)
  }

  const handleSortRow = (sortKey: string) => {
    setSortColumns(
      sortKey === sortColumns?.orderBy && sortColumns?.direction === 'descending'
        ? undefined
        : {
            orderBy: sortKey,
            direction:
              sortKey === sortColumns?.orderBy && sortColumns?.direction === 'ascending' ? 'descending' : 'ascending',
          }
    )
  }

  const iconBasedOnState = (key: string) => {
    return sortColumns?.orderBy === key ? (
      sortColumns?.direction === 'ascending' ? (
        <ArrowUpIcon title="up arrow" height={30} width={30} />
      ) : (
        <ArrowDownIcon title="up arrow" height={30} width={30} />
      )
    ) : (
      <ArrowsUpDownIcon title="up and down arrow" height={30} width={30} />
    )
  }

  return (
    <>
      <Heading level="3" size="medium">
        Produkter i produktserie
      </Heading>
      <SimilarProductsSlider seriesProducts={seriesProducts} />
      <Heading level="3" size="medium">
        Sammenlign teknisk data med andre produkter i produkserien
      </Heading>
      <div className="comparing-table comparing-table__two-sticky-columns">
        <Table sort={sortRows} onSortChange={(sortKey) => handleSortColumn(sortKey)}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader scope="col" sortKey="name" ref={colHeadRef} sortable>
                Egenskaper
              </Table.ColumnHeader>
              <Table.ColumnHeader style={{ left: keyColumnWidth > 0 ? keyColumnWidth : 'auto' }}>
                Dette produktet
              </Table.ColumnHeader>
              {sortedByKey.length > 0 &&
                sortedByKey.map((product, i) => (
                  <Table.ColumnHeader key={'id-' + product.id} style={{ height: '5px' }}>
                    <Link href={`/produkt/${product.id}`}>{'Produkt ' + (i + 1)}</Link>
                  </Table.ColumnHeader>
                ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row key={'hms-row'}>
              <Table.HeaderCell>
                <Button
                  className="sort-button"
                  size="small"
                  style={{ textAlign: 'left' }}
                  variant="tertiary"
                  onClick={() => handleSortRow('HMS')}
                  icon={iconBasedOnState('HMS')}
                >
                  HMS-artnr.
                </Button>
              </Table.HeaderCell>
              <Table.DataCell style={{ left: keyColumnWidth > 0 ? keyColumnWidth : 'auto' }}>
                {mainProduct.hmsArtNr !== undefined ? mainProduct.hmsArtNr : '-'}
              </Table.DataCell>
              {sortedByKey.map((product) => (
                <Table.DataCell key={'Hms-' + product.id}>
                  {product.hmsArtNr !== undefined ? product.hmsArtNr : '-'}
                </Table.DataCell>
              ))}
            </Table.Row>
            {sortedByKey.length > 0 &&
              Object.entries(rows)
                .sort(([key, row]) => (hasDifferentValues({ row }) ? -1 : 1))
                .map(([key, row]) => (
                  <Table.Row key={key + 'row'} className={hasDifferentValues({ row }) ? 'highlight' : ''}>
                    <Table.HeaderCell>
                      {hasDifferentValues({ row }) ? (
                        <Button
                          className="sort-button"
                          size="small"
                          style={{ textAlign: 'left' }}
                          variant="tertiary"
                          onClick={() => handleSortRow(key)}
                          icon={iconBasedOnState(key)}
                        >
                          {key}
                        </Button>
                      ) : (
                        <p>{key}</p>
                      )}
                    </Table.HeaderCell>
                    {row.map((value, i) =>
                      i == 0 ? (
                        <Table.DataCell
                          key={key + '-' + i}
                          style={{ left: keyColumnWidth > 0 ? keyColumnWidth : 'auto' }}
                        >
                          {value}
                        </Table.DataCell>
                      ) : (
                        <Table.DataCell key={key + '-' + i}>{value}</Table.DataCell>
                      )
                    )}
                  </Table.Row>
                ))}
          </Table.Body>
        </Table>
      </div>
    </>
  )
}

const SimilarProductsSlider = ({ seriesProducts }: { seriesProducts: Product[] }) => {
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
  return (
    <div className="similar-products__slider">
      {firstActive > 0 && (
        <Button
          variant="tertiary-neutral"
          className="arrow"
          onClick={() => {
            prevProduct()
          }}
          icon={<ChevronLeftIcon title="left arrow" height={30} width={30} />}
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
          icon={<ChevronRightIcon title="right arrow" height={30} width={30} />}
          // icon={<Next height={30} width={30} />}
        />
      )}
    </div>
  )
}

export default SimilarProducts
