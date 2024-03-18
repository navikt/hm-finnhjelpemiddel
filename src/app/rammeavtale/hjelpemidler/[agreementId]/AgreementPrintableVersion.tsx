'use client'

import ProductCard from '@/components/ProductCard'
import { Agreement, PostWithProducts } from '@/utils/agreement-util'
import { HStack, Heading, Table, VStack } from '@navikt/ds-react'

interface Props {
  agreement: Agreement
  postWithProducts: PostWithProducts[]
  pictureToggleValue: string
}

const AgreementPrintableVersion = ({ agreement, postWithProducts, pictureToggleValue }: Props) => {
  return (
    <VStack className="printable-version spacing-top--medium" gap="4">
      <Heading level="1" size="medium">
        {agreement.title}
      </Heading>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col"></Table.HeaderCell>
            <Table.HeaderCell scope="col">Delkontrakt</Table.HeaderCell>
            <Table.HeaderCell scope="col">Produkter</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {postWithProducts.map(({ nr, title, products }, i) => {
            const titleWithoutPostNumber = title.split(':' || '.')

            return (
              <Table.Row key={i}>
                <Table.DataCell>{nr}</Table.DataCell>
                <Table.DataCell style={{ maxWidth: '20rem' }}>{titleWithoutPostNumber[1]}</Table.DataCell>
                <Table.DataCell key={i}>
                  <HStack gap="4" wrap>
                    {products.map((productWithRank, i) => (
                      <ProductCard
                        product={productWithRank.product}
                        rank={productWithRank.rank}
                        type={pictureToggleValue === 'hide-pictures' ? 'no-picture' : 'plain'}
                        key={i}
                      />
                    ))}
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
