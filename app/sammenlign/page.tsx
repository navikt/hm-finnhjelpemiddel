'use client'
import { useState } from 'react'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

import { BodyShort, Heading } from '@navikt/ds-react/esm/typography'
import { Button, LinkPanel, Table } from '@navikt/ds-react'
import { Picture, Close, Back } from '@navikt/ds-icons'
import { Product } from '../../utils/product-util'
import { CompareMode, useHydratedCompareStore } from '../../utils/state-util'
import { PageWrapper } from '../animate-page-wrapper'

import './page.scss'
import { sortAlphabetically } from '../../utils/sort-util'

export default function ComparePage({ params }: any) {
  const { productsToCompare, removeProduct, setCompareMode } = useHydratedCompareStore()
  const router = useRouter()
  const href = '/'

  const handleClick = (event: any) => {
    event.preventDefault()
    setCompareMode(CompareMode.Active)
    router.push(href)
  }

  return (
    <PageWrapper>
      <div className="main-wrapper compare-page">
        <Heading level="1" size="large" spacing>
          Sammenlign produkter
        </Heading>

        {productsToCompare.length === 0 && (
          <section>
            <LinkPanel href={href} onClick={handleClick} border>
              <LinkPanel.Title>Legg til produkter for sammenligning</LinkPanel.Title>
              <LinkPanel.Description>
                For å kunne sammenligne produkter må de velges til sammenligning på søkesiden
              </LinkPanel.Description>
            </LinkPanel>
          </section>
        )}
        {productsToCompare.length > 0 && (
          <CompareTable productsToCompare={productsToCompare} removeProduct={removeProduct}></CompareTable>
        )}
      </div>
    </PageWrapper>
  )
}

const CompareTable = ({
  productsToCompare,
  removeProduct,
}: {
  productsToCompare: Product[]
  removeProduct: (product: Product) => void
}) => {
  const allDataKeys = productsToCompare
    .flatMap((prod) => Object.keys(prod.techData))
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((keyA, keyB) => sortAlphabetically(keyA, keyB))

  const rows: { [key: string]: string[] } = Object.assign(
    {},
    ...allDataKeys.map((key) => ({
      [key]: productsToCompare.map((product) =>
        product.techData[key] !== undefined ? product.techData[key].value + product.techData[key].unit : '-'
      ),
    }))
  )

  const hasDifferentValues = ({ row }: { row: string[] }) => {
    let uniqueValues = new Set(row)
    uniqueValues.delete('-')
    return uniqueValues.size > 1
  }

  return (
    <section className="comparing-table">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>
              <Heading level="2" size="medium" spacing>
                Produkter
              </Heading>
              <NextLink className="back-to-search" href="/">
                <Back title="Tilbake til søk" />
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
          <Table.Row style={{ position: 'sticky', left: 0 }}>
            <Table.DataCell colSpan={2} style={{ position: 'sticky', left: 0 }}>
              <Heading level="2" size="medium">
                Tekniske egenskaper
              </Heading>
            </Table.DataCell>
            {productsToCompare.length > 1 && (
              <Table.DataCell
                colSpan={productsToCompare.length - 1}
                style={{ position: 'sticky', left: 0 }}
              ></Table.DataCell>
            )}
          </Table.Row>
          {productsToCompare.length > 0 &&
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
    </section>
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
        icon={<Close title="Fjern produkt fra sammenligning" />}
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
