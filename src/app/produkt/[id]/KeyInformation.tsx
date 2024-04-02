'use client'

import DefinitionList from '@/components/definition-list/DefinitionList'
import { Product } from '@/utils/product-util'
import { ArrowDownIcon } from '@navikt/aksel-icons'
import { BodyShort, Heading, HelpText, Link, Table } from '@navikt/ds-react'
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

  const bo = new Set(product.variants.map((p) => p.bestillingsordning))
  const ds = new Set(product.variants.map((p) => p.digitalSoknad))

  const bestillingsordning =
    bo.size > 1 ? (
      <BodyShort>
        Noen varianter.{' '}
        <Link as={NextLink} href="#produktvarianter">
          Se tabell nedenfor.
        </Link>
      </BodyShort>
    ) : bo.has(true) ? (
      <BodyShort>Ja</BodyShort>
    ) : (
      <BodyShort>Nei</BodyShort>
    )

  const digitalSoknad =
    ds.size > 1 ? (
      <BodyShort>
        Noen varianter.{' '}
        <Link as={NextLink} href="#produktvarianter">
          Se tabell nedenfor.
        </Link>
      </BodyShort>
    ) : ds.has(true) ? (
      <BodyShort>Ja</BodyShort>
    ) : (
      <BodyShort>Nei</BodyShort>
    )

  if (!product.agreements?.length) {
    return (
      <>
        <Heading level="2" size="medium">
          Nøkkelinfo
        </Heading>
        <DefinitionList>
          <DefinitionList.Term>Leverandør</DefinitionList.Term>
          <DefinitionList.Definition>{supplierName}</DefinitionList.Definition>
          <DefinitionList.Term>
            <Bestillingsordning_HelpText />
          </DefinitionList.Term>
          <DefinitionList.Definition>{bestillingsordning}</DefinitionList.Definition>
          <DefinitionList.Term>
            <DigitalSoknad_HelpText />
          </DefinitionList.Term>
          <DefinitionList.Definition>{digitalSoknad}</DefinitionList.Definition>
        </DefinitionList>
      </>
    )
  }

  if (product.agreements.length === 1) {
    return (
      <>
        <Heading level="2" size="medium">
          Nøkkelinfo
        </Heading>
        <DefinitionList>
          <DefinitionList.Term>Rangering</DefinitionList.Term>
          <DefinitionList.Definition>
            {product.agreements[0].rank && product.agreements[0].rank < 90 ? product.agreements[0].rank : 'Urangert'}
          </DefinitionList.Definition>
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
          <DefinitionList.Definition>{bestillingsordning}</DefinitionList.Definition>
          <DefinitionList.Term>
            <DigitalSoknad_HelpText />
          </DefinitionList.Term>
          <DefinitionList.Definition>{digitalSoknad}</DefinitionList.Definition>
        </DefinitionList>
      </>
    )
  }

  return (
    <>
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
                <Table.DataCell align="center">
                  {agreement.rank && agreement.rank < 90 ? agreement.rank : 'Urangert'}
                </Table.DataCell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
      <Link href="#" onClick={scrollToAgreementInfo}>
        Se flere produkter på disse delkontrakene
        <ArrowDownIcon title="a11y-title" fontSize="1.5rem" />
      </Link>

      <DefinitionList>
        <DefinitionList.Term>Leverandør</DefinitionList.Term>
        <DefinitionList.Definition>{supplierName}</DefinitionList.Definition>
        <DefinitionList.Term>
          <Bestillingsordning_HelpText />
        </DefinitionList.Term>
        <DefinitionList.Definition>{bestillingsordning}</DefinitionList.Definition>
        <DefinitionList.Term>
          <DigitalSoknad_HelpText />
        </DefinitionList.Term>
        <DefinitionList.Definition>{digitalSoknad}</DefinitionList.Definition>
      </DefinitionList>
    </>
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

const DigitalSoknad_HelpText = () => {
  return (
    <div className="product-info__help-text">
      Digital behovsmelding
      <HelpText placement="right" strategy="absolute">
        Digital behovsmelding betyr at man kan melde behov for hjelpemidler digitalt, og gjelder for et utvalg av
        hjelpemidler innen utvalgte kategorier. Ordningen kan benyttes av kommunalt ansatte.
      </HelpText>
    </div>
  )
}
