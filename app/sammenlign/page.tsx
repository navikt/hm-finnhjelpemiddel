'use client'
import { useState } from 'react'
import Image from 'next/image'
import NextLink from 'next/link'

import { BodyShort, Heading } from '@navikt/ds-react/esm/typography'
import { Button, Table } from '@navikt/ds-react'
import { Picture, Close, Back } from '@navikt/ds-icons'
import { Product } from '../../utils/product-util'
import { useHydratedPCStore } from '../../utils/state-util'

import './page.scss'

export default function ComparePage({ params }: any) {
  const { productsToCompare, removeProduct } = useHydratedPCStore()

  const allDataKeys = productsToCompare
    .flatMap((prod) => prod.techData.map((td) => td.key))
    .filter((v, i, a) => a.indexOf(v) === i)

  return (
    <div className="main-wrapper compare-page">
      <Heading level="1" size="large" spacing>
        Sammenlign produkter
      </Heading>

      <div className="comparing-table">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>
                <Heading level="2" size="medium" spacing>
                  Produkter
                </Heading>
                <NextLink className="back-to-search" href="/">
                  <Back title="Tilbake til sok" />
                  <BodyShort>Legg til flere</BodyShort>
                </NextLink>
              </Table.ColumnHeader>
              {productsToCompare.length > 0 &&
                productsToCompare.map((product, i) => (
                  <Table.ColumnHeader key={'id-' + product.id} style={{ height: '5px' }}>
                    <ProductTableHeader product={product} removeProduct={removeProduct} />
                  </Table.ColumnHeader>
                ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.DataCell colSpan={productsToCompare.length + 1}>
                <Heading level="2" size="medium">
                  Tekniske egenskaper
                </Heading>
              </Table.DataCell>
            </Table.Row>
            {productsToCompare.length > 0 &&
              allDataKeys.map((key) => (
                <Table.Row key={key + 'row'}>
                  <Table.HeaderCell>{key}</Table.HeaderCell>
                  {productsToCompare.map((product) => (
                    <Table.DataCell key={key + '-' + product.id}>
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
      <BodyShort>
        <NextLink className="compare-page__link" href={`/produkt/${product.id}`}>
          {product.title}
        </NextLink>
      </BodyShort>
    </div>
  )
}
