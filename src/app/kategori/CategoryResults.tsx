'use client'

import React, { useState } from 'react'
import { Alert, BodyLong, BodyShort, Button, Heading, HStack, Tag, VStack } from '@navikt/ds-react'
import { CompareMenuState, useHydratedCompareStore } from '@/utils/global-state-util'
import { Product } from '@/utils/product-util'
import { ProductCardCategory } from '@/app/kategori/ProductCardCategory'
import { ChevronDownIcon } from '@navikt/aksel-icons'
import CompareMenu from '@/components/layout/CompareMenu'

export const CategoryResults = ({ products }: { products: Product[] }) => {
  const { setCompareMenuState } = useHydratedCompareStore()
  const [firstCompareClick, setFirstCompareClick] = useState(true)

  const delkontraktGroups = groupByDelkontrakt(products)
  const nonAgreementGroup = delkontraktGroups['Ikke på avtale']
  const productsTotalCount = products.length
  const nonAgreementProductsCount = nonAgreementGroup?.products.length ?? 0
  const agreementProductsCount = productsTotalCount - nonAgreementProductsCount

  //viser færre ikke-avtale-produkter hvis det er mange på avtale, for lettere kognitiv last
  const [visibleNonAgreementProductsCount, setvisibleNonAgreementProductsCount] = useState(
    agreementProductsCount > 24 ? 6 : 12 //tall vi har bare funnet på
  )

  const handleCompareClick = () => {
    if (firstCompareClick) {
      setCompareMenuState(CompareMenuState.Open)
    }
    setFirstCompareClick(false)
  }

  if (products && productsTotalCount === 0) {
    return (
      <Alert variant="info">
        <BodyLong>Obs! Fant ingen hjelpemidler. Har du sjekket filtrene dine?</BodyLong>
      </Alert>
    )
  }

  const visibleNonAgreementProducts = nonAgreementGroup?.products.slice(0, visibleNonAgreementProductsCount) ?? []

  const VIEW_MORE_MAX_BATCH_SIZE = 12
  const nextBatchSize = Math.min(VIEW_MORE_MAX_BATCH_SIZE, nonAgreementProductsCount - visibleNonAgreementProductsCount)

  const visibleProductsCount = agreementProductsCount + visibleNonAgreementProducts.length

  return (
    <VStack gap="space-16">
      <CompareMenu />
      <BodyShort>{`Viser ${visibleProductsCount} av ${productsTotalCount} hjelpemidler`}</BodyShort>
      <VStack gap={'space-40'}>
        {Object.entries(delkontraktGroups)
          .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
          .filter(([delkontraktName]) => delkontraktName !== 'Ikke på avtale')
          .map(([delkontraktName, delkontraktGroup]) => (
            <DelkontraktGroup
              delkontraktProducts={delkontraktGroup}
              handleCompareClick={handleCompareClick}
              key={delkontraktName}
            />
          ))}
        {nonAgreementGroup && (
          <DelkontraktGroup
            delkontraktProducts={{
              refNr: nonAgreementGroup.refNr,
              postTitle: nonAgreementGroup.postTitle,
              normalizedTitle: nonAgreementGroup.normalizedTitle,
              products: nonAgreementGroup.products.slice(0, visibleNonAgreementProductsCount),
            }}
            handleCompareClick={handleCompareClick}
          />
        )}
      </VStack>
      {visibleNonAgreementProductsCount < nonAgreementProductsCount && (
        <Button
          variant="tertiary"
          size="medium"
          icon={<ChevronDownIcon aria-hidden />}
          iconPosition={'right'}
          onClick={() => setvisibleNonAgreementProductsCount((prev) => prev + nextBatchSize)}
          style={{ alignSelf: 'center' }}
        >
          Vis {nextBatchSize} flere treff
        </Button>
      )}
    </VStack>
  )
}

const DelkontraktGroup = ({
  delkontraktProducts,
  handleCompareClick,
}: {
  delkontraktProducts: DelkontraktProducts
  handleCompareClick: () => void
}) => {
  return (
    <VStack gap={'space-16'} style={{ borderTop: '1px solid #CFD3D8' }}>
      <HStack gap={'space-8'} align={'center'} paddingBlock={'space-16 space-0'}>
        {delkontraktProducts.refNr !== '0' && (
          <Tag size={'medium'} data-color={'info'} variant={'moderate'}>
            På avtale
          </Tag>
        )}
        <Heading size={'small'}>{delkontraktProducts.normalizedTitle}</Heading>
      </HStack>
      <HStack gap={{ xs: 'space-16', md: 'space-20' }}>
        {delkontraktProducts.products
          .sort((a, b) => {
            if (delkontraktProducts.postTitle === '') {
              return 0
            }

            return (
              (a.agreements.find((agreement) => agreement.postTitle === delkontraktProducts.postTitle)?.rank ?? 0) -
              (b.agreements.find((agreement) => agreement.postTitle === delkontraktProducts.postTitle)?.rank ?? 0)
            )
          })
          .map((product) => (
            <ProductCardCategory
              key={product.id}
              product={product}
              postTitle={delkontraktProducts.postTitle}
              handleCompareClick={handleCompareClick}
            />
          ))}
      </HStack>
    </VStack>
  )
}

type ProductsByDelkontrakt = {
  [key: string]: DelkontraktProducts
}

type DelkontraktProducts = {
  refNr: string
  postTitle: string
  normalizedTitle: string
  products: Product[]
}

const groupByDelkontrakt = (products: Product[] | undefined): ProductsByDelkontrakt => {
  const productsByDelkonktrakt: ProductsByDelkontrakt = {}

  products?.forEach((product) => {
    if (product.agreements.length === 0) {
      if (!productsByDelkonktrakt['Ikke på avtale']) {
        productsByDelkonktrakt['Ikke på avtale'] = {
          refNr: '0',
          postTitle: '',
          normalizedTitle: 'Ikke på avtale',
          products: [],
        }
      }

      productsByDelkonktrakt['Ikke på avtale'].products.push(product)
    }

    product.agreements.forEach((agreement) => {
      const delkontrakt = agreement.postTitle!
      const normalizedTitle = delkontrakt.split(/[):.]\s*/)

      if (delkontrakt !== null) {
        if (!productsByDelkonktrakt[delkontrakt]) {
          productsByDelkonktrakt[delkontrakt] = {
            refNr: agreement.refNr!,
            postTitle: agreement.postTitle ?? '',
            normalizedTitle: normalizedTitle[1],
            products: [],
          }
        }

        productsByDelkonktrakt[delkontrakt].products.push(product)
      }
    })
  })

  return productsByDelkonktrakt
}
