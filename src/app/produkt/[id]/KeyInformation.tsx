'use client'

import { Product } from '@/utils/product-util'

import DefinitionList from '@/components/definition-list/DefinitionList'
import { Heading, Link, Table, VStack } from '@navikt/ds-react'
import { ArrowDownIcon } from '@navikt/aksel-icons'

type KeyInformationProps = {
  product: Product
  supplierName: string | null
}

const KeyInformation = ({ product, supplierName }: KeyInformationProps) => {
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    })
  }
  if (!product.agreements?.length) {
    return (
      <div className="product-info__key-information">
        <Heading level="2" size="medium">
          Nøkkelinfo
        </Heading>
        <DefinitionList>
          <DefinitionList.Term>Leverandør</DefinitionList.Term>
          <DefinitionList.Definition>{supplierName}</DefinitionList.Definition>
          <DefinitionList.Term>Bestillingsordning</DefinitionList.Term>
          <DefinitionList.Definition>{product.attributes.bestillingsordning ? 'Ja' : 'Nei'}</DefinitionList.Definition>
        </DefinitionList>
      </div>
    )
  }

  if (product.agreements.length === 1) {
    return (
      <div className="product-info__key-information">
        <Heading level="2" size="medium">
          Nøkkelinfo
        </Heading>
        <DefinitionList>
          <DefinitionList.Term>Rangering</DefinitionList.Term>
          <DefinitionList.Definition>{product.agreements[0].rank ?? 'Urangert'}</DefinitionList.Definition>
          <DefinitionList.Term>Delkontrakt</DefinitionList.Term>
          <DefinitionList.Definition>
            <Link href="#" onClick={scrollToBottom}>
              {product.agreements[0].postTitle ?? product.attributes?.text}
            </Link>
          </DefinitionList.Definition>
          <DefinitionList.Term>Avtale</DefinitionList.Term>
          <DefinitionList.Definition>{product.agreements[0].title}</DefinitionList.Definition>
          <DefinitionList.Term>Leverandør</DefinitionList.Term>
          <DefinitionList.Definition>{supplierName}</DefinitionList.Definition>
          <DefinitionList.Term>Bestillingsordning</DefinitionList.Term>
          <DefinitionList.Definition>{product.attributes.bestillingsordning ? 'Ja' : 'Nei'}</DefinitionList.Definition>
        </DefinitionList>
      </div>
    )
  }

  return (
    <div className="product-info__key-information">
      <VStack gap="4">
        <Heading level="2" size="medium">
          Nøkkelinfo
        </Heading>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader scope="col">Delkontrakt</Table.ColumnHeader>
              <Table.ColumnHeader scope="col">Rangering</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {product.agreements.map((agreement, i) => {
              return (
                <Table.Row key={i}>
                  <Table.DataCell scope="row">{agreement.postTitle}</Table.DataCell>
                  <Table.DataCell align="center">{agreement.rank}</Table.DataCell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
        <Link href="#" onClick={scrollToBottom}>
          Se flere produkter på disse delkontrakene
          <ArrowDownIcon title="a11y-title" fontSize="1.5rem" />
        </Link>

        <DefinitionList>
          <DefinitionList.Term>Leverandør</DefinitionList.Term>
          <DefinitionList.Definition>{supplierName}</DefinitionList.Definition>
          <DefinitionList.Term>Bestillingsordning</DefinitionList.Term>
          <DefinitionList.Definition>{product.attributes.bestillingsordning ? 'Ja' : 'Nei'}</DefinitionList.Definition>
        </DefinitionList>
      </VStack>
    </div>
  )
}

export default KeyInformation
