'use client'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

import useSWR from 'swr'

import { fetchProductVariants } from '@/utils/api-util'
import { CompareMenuState, useHydratedCompareStore } from '@/utils/global-state-util'
import { ProductVariant } from '@/utils/product-util'

import { BodyLong, ChevronRightIcon, Heading, Link, Loader, Table } from '@/components/aksel-client'
import AnimateLayout from '@/components/layout/AnimateLayout'
import { ArrowLeftIcon } from '@navikt/aksel-icons'
import { useEffect, useState } from 'react'
import { AlternativeProduct, isAlternativeProduct } from "@/app/alternativprodukter/alternative-util";
import { AlternativeProductCard } from "@/app/alternativprodukter/AlternativeProductCard";

export default function CompareAlternativesPage() {
  const { productsToCompare, setCompareMenuState } = useHydratedCompareStore()
  const router = useRouter()
  const [shouldFetch, setShouldFetch] = useState(true)
  const [alternativeProductsWithVariant, setAlternativeProductsWithVariant] = useState<AlternativeProductWithVariant[]>([])

  const alternativeProductsToCompare = productsToCompare.filter((product) => isAlternativeProduct(product))

  const { data: variants, isLoading: isLoadingVariants } = useSWR<ProductVariant[]>(
    alternativeProductsToCompare.map((product) => product.id),
    fetchProductVariants,
    { keepPreviousData: true }
  )

  useEffect(() => {
    if (variants) {
      const productsWithVariants = alternativeProductsToCompare.map((alternativeProduct): AlternativeProductWithVariant => {
        const variant = variants.find((v) => v.id === alternativeProduct.id);
        return { alternativeProduct, variant };
      });
      setAlternativeProductsWithVariant(productsWithVariants);
    }
  }, [variants, alternativeProductsToCompare]);

  const handleClick = (event: any) => {
    event.preventDefault()
    setCompareMenuState(CompareMenuState.Open)
    router.back()
  }

  if (isLoadingVariants) {
    return (
      <div className="main-wrapper--large compare-page spacing-top--large spacing-bottom--xlarge">
        <Heading level="1" size="large" spacing>
          Sammenlign produkter
        </Heading>

        <div id="searchResults" className="results__loader">
          <Loader size="3xlarge" title="Laster produkter" />
        </div>
      </div>
    )
  }

  return (
    <AnimateLayout>
      <div className="main-wrapper--xlarge compare-page spacing-top--large spacing-bottom--xlarge">
        <Heading level="1" size="large" spacing>
          Sammenlign produkter
        </Heading>

        {variants && variants.length === 0 ? (
          <section>
            <NextLink
              className="navds-panel navds-link-panel navds-panel--border"
              style={{ maxWidth: '750px' }}
              href={'/sok'}
              onClick={handleClick}
            >
              <div className="navds-link-panel__content">
                <div className="navds-link-panel__title navds-heading navds-heading--medium">
                  Legg til produkter for sammenligning
                </div>
                <BodyLong>For å kunne sammenligne produkter må de velges til sammenligning på oversikt over
                  alternativprodukter</BodyLong>
              </div>
              <ChevronRightIcon aria-hidden />
            </NextLink>
          </section>
        ) : (
          <>{variants && <CompareTable alternativeProductsWithVariants={alternativeProductsWithVariant} />}</>
        )}
      </div>
    </AnimateLayout>
  )
}

const CompareTable = ({ alternativeProductsWithVariants }: { alternativeProductsWithVariants: AlternativeProductWithVariant[] }) => {
  const router = useRouter()

  const allDataKeysVariants = [
    ...new Set(
      alternativeProductsWithVariants.map((product) => Object.keys(product.variant!.techData)).flat()
    ),
  ].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))


  return (
    <section>
      <Link as={NextLink} href="" onClick={() => router.back()}>
        <ArrowLeftIcon fontSize="1.5rem" aria-hidden />
        Legg til flere produkter
      </Link>
      <div className="compare-table-container">
        <Table zebraStripes>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader className="common_headercell"></Table.ColumnHeader>
              {alternativeProductsWithVariants.map((product) => (
                <Table.ColumnHeader className="header" key={'id-' + product.alternativeProduct.id}>
                  <AlternativeProductCard alternativeProduct={product.alternativeProduct} selectedWarehouseStock={undefined} />
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.HeaderCell className="side_header">Rangering</Table.HeaderCell>
              {alternativeProductsWithVariants.map((product) => {
                return (
                  <Table.DataCell key={product.alternativeProduct.id}>{product.alternativeProduct.highestRank}</Table.DataCell>
                )
              })}
            </Table.Row>

            <Table.Row>
              <Table.HeaderCell className="side_header">HMS-nummer</Table.HeaderCell>
              {alternativeProductsWithVariants.map((product) => (
                <Table.DataCell key={product.alternativeProduct.id}>
                  {product.variant?.hmsArtNr}
                </Table.DataCell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell className="side_header">Leverandør</Table.HeaderCell>
              {alternativeProductsWithVariants.map((product) => (
                <Table.DataCell key={product.alternativeProduct.id}>{product.alternativeProduct.supplierName}</Table.DataCell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell className="side_header">
                <Heading level="2" size="medium">
                  Tekniske egenskaper
                </Heading>
              </Table.HeaderCell>
              {alternativeProductsWithVariants.length > 1 && <Table.DataCell colSpan={alternativeProductsWithVariants.length + 1}></Table.DataCell>}
            </Table.Row>

          </Table.Body>
        </Table>
      </div>
    </section>
  )
}

interface AlternativeProductWithVariant {
  alternativeProduct: AlternativeProduct,
  variant?: ProductVariant
}
