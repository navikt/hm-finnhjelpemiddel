'use client'

import ProductCard from '@/components/ProductCard'
import { PostWithProducts } from '@/utils/agreement-util'
import { BodyShort, HStack, Table, VStack } from '@navikt/ds-react'

interface Props {
  postWithProducts: PostWithProducts[]
}

const AgreementPrintableVersion = ({ postWithProducts }: Props) => {
  return (
    <VStack className="printable-version spacing-top--medium">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col"></Table.HeaderCell>
            <Table.HeaderCell scope="col">Delkontrakt</Table.HeaderCell>
            <Table.HeaderCell scope="col">Hjelpemidler</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {postWithProducts.map(({ nr, title, products }, i) => {
            const titleWithoutPostNumber = title.split(':' || '.')

            return (
              <Table.Row key={i}>
                <Table.DataCell>{nr}</Table.DataCell>
                <Table.DataCell
                  className="printable-version__post-title"
                  style={{ maxWidth: '15rem', fontSize: '16px' }}
                >
                  {titleWithoutPostNumber[1]}
                </Table.DataCell>
                <Table.DataCell key={i}>
                  <HStack gap="2" wrap>
                    {!products.length ? (
                      <BodyShort>Delkontrakten inneholder ingen hjelpemidler</BodyShort>
                    ) : (
                      <>
                        {products.map((productWithRankAndSupplier, i) => {
                          return (
                            <ProductCard
                              product={productWithRankAndSupplier.product}
                              rank={productWithRankAndSupplier.rank}
                              type={'print'}
                              key={i}
                            />
                          )
                        })}
                      </>
                    )}
                  </HStack>
                </Table.DataCell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </VStack>
  )
}

export default AgreementPrintableVersion
