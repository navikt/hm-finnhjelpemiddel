import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowsUpDownIcon, ArrowUpIcon, ArrowDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons'
import { Table, Heading, Button, Switch } from '@navikt/ds-react'
import { Product } from '../../utils/product-util'
import { sortIntWithStringFallback } from '../../utils/sort-util'

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
  const [sortColumns, setSortColumns] = useState<SortColumns | undefined>({ orderBy: 'HMS', direction: 'ascending' })
  const [showAllRows, setShowAllRows] = useState<boolean>(false)
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
    .sort()

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

  const rowsWithDifferentValues: { [key: string]: string[] } = Object.fromEntries(
    Object.entries(rows).filter(([key, row]) => hasDifferentValues({ row }))
  )
  const rowsWithSameValues: { [key: string]: string[] } = Object.fromEntries(
    Object.entries(rows).filter(([key, row]) => !hasDifferentValues({ row }))
  )

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
        Produkt varianter
      </Heading>
      <Heading level="4" size="small">
        Sammenlign variantene av produktet
      </Heading>
      <Switch
        size="small"
        checked={showAllRows}
        onChange={() => {
          setShowAllRows(!showAllRows)
        }}
      >
        Slå på for å vise rader med ingen forskjeller i tabellen under
      </Switch>
      <div className="comparing-table comparing-table__two-sticky-columns">
        <Table>
          <Table.Header>
            <Table.Row key={'hms-row'}>
              <Table.ColumnHeader ref={colHeadRef}>
                <Button
                  className="sort-button"
                  size="small"
                  style={{ textAlign: 'left' }}
                  variant="tertiary"
                  onClick={() => handleSortRow('HMS')}
                  icon={iconBasedOnState('HMS')}
                >
                  HMS-nr.
                </Button>
              </Table.ColumnHeader>
              <Table.ColumnHeader style={{ left: keyColumnWidth > 0 ? keyColumnWidth : 'auto' }}>
                {mainProduct.hmsArtNr !== undefined ? mainProduct.hmsArtNr : '-'}
              </Table.ColumnHeader>
              {sortedByKey.map((product) => (
                <Table.ColumnHeader key={'Hms-' + product.id}>
                  {/* {product.hmsArtNr !== undefined ? product.hmsArtNr : '-'} */}
                  <Link href={`/produkt/${product.id}`}>{product.hmsArtNr}</Link>
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.keys(rowsWithDifferentValues).length > 0 &&
              Object.entries(rowsWithDifferentValues).map(([key, row], i) => (
                <Table.Row
                  key={key + 'row'}
                  className={Object.keys(rowsWithDifferentValues).length == i + 1 ? 'row-with-different-values' : 'asd'}
                >
                  <Table.HeaderCell>
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

            {showAllRows &&
              Object.keys(rowsWithSameValues).length > 0 &&
              Object.entries(rowsWithSameValues).map(([key, row]) => (
                <Table.Row key={key + 'row'}>
                  <Table.HeaderCell>
                    <p>{key}</p>
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
