import { ProductVariant } from '@/utils/product-util'
import { smallImageLoader } from '@/utils/image-util'
import { BodyShort, CopyButton, Hide, Link, Skeleton, Table } from '@navikt/ds-react'
import styles from './PartsTable.module.scss'
import { ThumbUpIcon } from '@navikt/aksel-icons'
import Image from 'next/image'
import NextLink from 'next/link'

const PartThumbnail = ({ product }: { product: ProductVariant }) => {
  const seriesId = product.seriesId
  const photoUri = product.photos.at(0)?.uri

  if (!seriesId || !photoUri) {
    return null
  }

  return (
    <Link
      as={NextLink}
      href={`/produkt/${seriesId}`}
      className={styles.thumbnailLink}
      aria-label={`Åpne ${product.articleName}`}
    >
      <Image
        loader={smallImageLoader}
        src={photoUri}
        alt=""
        width={40}
        height={40}
        className={styles.thumbnail}
      />
    </Link>
  )
}

export const PartsTable = ({ products }: { products: ProductVariant[] }) => {
  if (!products) {
    return <Skeleton />
  }

  if (products.length === 0) {
    return <BodyShort>Fant ingen deler.</BodyShort>
  }

  return (
    <Table zebraStripes>
      <Table.Header>
        <Table.Row>
          <Hide below={'md'} asChild>
            <Table.HeaderCell scope="col">
              Bilde
            </Table.HeaderCell>
          </Hide>
          <Table.HeaderCell scope="col">HMS-nummer</Table.HeaderCell>
          <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
          <Hide below={'md'} asChild>
            <Table.HeaderCell scope="col">Leverandørnavn</Table.HeaderCell>
          </Hide>
          <Table.HeaderCell scope="col">Lev-artnr</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {products.map((product) => (
          <Table.Row key={product.id}>
            <Hide below={'md'} asChild>
              <Table.DataCell>
                <PartThumbnail product={product} />
              </Table.DataCell>
            </Hide>
            <Table.DataCell>
              <CopyButton
                size="small"
                copyText={product.hmsArtNr ?? ''}
                text={product.hmsArtNr ?? ''}
                activeText="Kopiert"
                variant="action"
                activeIcon={<ThumbUpIcon aria-hidden />}
                iconPosition="right"
                className={styles.copyButton}
              />
            </Table.DataCell>
            <Table.DataCell>
              <Link
                as={NextLink}
                href={`/produkt/${product.seriesId}`}
                className={styles.link}
              >
                {product.articleName}
              </Link>
            </Table.DataCell>
            <Hide below={'md'} asChild>
              <Table.DataCell>{product.supplierName}</Table.DataCell>
            </Hide>
            <Table.DataCell>{product.supplierRef}</Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
