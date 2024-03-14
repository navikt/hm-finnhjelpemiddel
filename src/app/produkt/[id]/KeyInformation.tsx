'use client'

import DefinitionList from '@/components/definition-list/DefinitionList'
import { Product } from '@/utils/product-util'
import { ArrowDownIcon } from '@navikt/aksel-icons'
import { BodyShort, Heading, HelpText, Link, Table, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

type KeyInformationProps = {
  product: Product
  supplierName: string | null
}

const KeyInformation = ({ product, supplierName }: KeyInformationProps) => {
  const router = useRouter()

  const scrollToAgreementInfo = () => {
    router.push(`/produkt/${product.id}#agreement-info`)
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
          <DefinitionList.Term>
            <Bestillingsordning_HelpText />
          </DefinitionList.Term>
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
            <Link href="#" onClick={scrollToAgreementInfo}>
              {product.agreements[0].postTitle}
            </Link>
          </DefinitionList.Definition>
          <DefinitionList.Term>Avtale</DefinitionList.Term>
          <DefinitionList.Definition>
            <Link as={NextLink} href={`/rammeavtale/hjelpemidler/${product.agreements[0].id}`}>
              <BodyShort> {product.agreements[0].title} </BodyShort>
            </Link>
          </DefinitionList.Definition>
          <DefinitionList.Term>Leverandør</DefinitionList.Term>
          <DefinitionList.Definition>{supplierName}</DefinitionList.Definition>
          <DefinitionList.Term>
            <Bestillingsordning_HelpText />
          </DefinitionList.Term>
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
              <Table.ColumnHeader scope="col">Avtale</Table.ColumnHeader>
              <Table.ColumnHeader scope="col">Delkontrakt</Table.ColumnHeader>
              <Table.ColumnHeader scope="col">Rangering</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {product.agreements.map((agreement, i) => {
              return (
                <Table.Row key={i}>
                  <Table.DataCell scope="row">
                    <Link as={NextLink} href={`/rammeavtale/hjelpemidler/${product.agreements[0].id}`}>
                      {agreement.title}
                    </Link>
                  </Table.DataCell>
                  <Table.DataCell scope="row">{agreement.postTitle}</Table.DataCell>
                  <Table.DataCell align="center">{agreement.rank}</Table.DataCell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
        <Link href="#" onClick={scrollToAgreementInfo} className="spacing-bottom--medium">
          Se flere produkter på disse delkontrakene
          <ArrowDownIcon title="a11y-title" fontSize="1.5rem" />
        </Link>

        <DefinitionList>
          <DefinitionList.Term>Leverandør</DefinitionList.Term>
          <DefinitionList.Definition>{supplierName}</DefinitionList.Definition>
          <DefinitionList.Term>
            <Bestillingsordning_HelpText />
          </DefinitionList.Term>
          <DefinitionList.Definition>{product.attributes.bestillingsordning ? 'Ja' : 'Nei'}</DefinitionList.Definition>
        </DefinitionList>
      </VStack>
    </div>
  )
}

export default KeyInformation

const Bestillingsordning_HelpText = () => {
  return (
    <div className="product-info__help-text">
      Bestillingsordning
      <HelpText placement="right" strategy="absolute">
        Bestillingsordningen er en forenkling av saksbehandling. Gjennom denne ordningen kan man bestille enkle
        hjelpemidler som hjelpemiddelsentralene har på lager.
      </HelpText>
    </div>
  )
}
