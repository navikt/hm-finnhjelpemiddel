'use client'
import { useState } from 'react'
import Image from 'next/image'

import { BodyShort, Heading } from '@navikt/ds-react/esm/typography'
import { Button, Table } from '@navikt/ds-react'
import { Picture, Close } from '@navikt/ds-icons'
import { Product } from '../../utils/product-util'
import { useHydratedPCStore } from '../../utils/state-util'

import '../../styles/comparing-table.scss'
import './compare.scss'

export default function ComparePage({ params }: any) {
  const { productsToCompare, removeProduct } = useHydratedPCStore()
  // const productsToCompare = []

  const allDataKeys = productsToCompare.flatMap((prod) => prod.techData.map((td) => td.key))

  return (
    <div className="main-wrapper compare-page">
      <Heading level="1" size="large">
        Sammenlign produkter
      </Heading>
      <Heading level="2" size="medium">
        Tekniske egenskaper
      </Heading>
      <div className="comparing-table">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>
                <Heading level="2" size="medium">
                  Produkter
                </Heading>
              </Table.ColumnHeader>
              {productsToCompare.length > 0 &&
                productsToCompare.map((product, i) => (
                  <Table.ColumnHeader key={product.id + i}>
                    <ProductTableHeader product={product} removeProduct={removeProduct} />
                  </Table.ColumnHeader>
                ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {productsToCompare.length > 0 &&
              allDataKeys.map((key) => (
                <Table.Row>
                  <Table.HeaderCell>{key}</Table.HeaderCell>
                  {productsToCompare.map((product) => (
                    <Table.DataCell>
                      {product.techDataDict[key] !== undefined
                        ? product.techDataDict[key].value + product.techDataDict[key].unit
                        : '-'}
                    </Table.DataCell>
                  ))}
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}

const ProductTableHeader = ({
  product,
  removeProduct,
}: {
  product: Product
  removeProduct: (product: Product) => void
}) => {
  const hasImage = product.photos.length !== 0
  const [firstImageSrc] = useState(product.photos.at(0)?.uri || '')

  const imageLoader = ({ src }: { src: string }) => {
    return `https://www.hjelpemiddeldatabasen.no/blobs/snet/${src}`
  }
  return (
    <div className="product-header">
      <Button
        className="remove-product-button"
        size="small"
        variant="tertiary"
        onClick={() => removeProduct(product)}
        icon={<Close title="Fjern produkt fra sammenlikning" />}
      />
      <div className="product-image">
        {!hasImage && (
          <Picture width={150} height="auto" style={{ background: 'white' }} aria-label="Ingen bilde tilgjengelig" />
        )}
        {hasImage && (
          <Image loader={imageLoader} src={firstImageSrc} alt="Produktbilde" width="0" height="0" sizes="100vw" />
        )}
      </div>
      <BodyShort>{product.title}</BodyShort>
    </div>
  )
}
