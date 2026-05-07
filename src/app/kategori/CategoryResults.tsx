'use client'

import React, { useState } from 'react'
import { Alert, BodyLong, BodyShort, Button, Heading, HStack, Tag, VStack } from '@navikt/ds-react'
import { CompareMenuState, useHydratedCompareStore } from '@/utils/global-state-util'
import { Product } from '@/utils/product-util'
import { ProductCardCategory } from '@/app/kategori/ProductCardCategory'
import { ChevronDownIcon } from '@navikt/aksel-icons'
import CompareMenu from '@/components/layout/CompareMenu'

const SHOW_MORE_SIZE = 12

export const CategoryResults = ({ products }: { products: Product[] }) => {
  const { setCompareMenuState } = useHydratedCompareStore()
  const [firstCompareClick, setFirstCompareClick] = useState(true)

  const delkontraktGroups = groupByDelkontrakt(products)
  const nonAgreementGroup = delkontraktGroups['Ikke på avtale']
  const totalNonAgreementProducts = nonAgreementGroup?.products.length ?? 0

  const [nonAgreementShowCount, setNonAgreementShowCount] = useState(
    products.length - totalNonAgreementProducts > 24 ? 6 : 12
  )

  const handleCompareClick = () => {
    if (firstCompareClick) {
      setCompareMenuState(CompareMenuState.Open)
    }
    setFirstCompareClick(false)
  }

  if (products && products.length === 0) {
    return (
      <Alert variant="info">
        <BodyLong>Obs! Fant ingen hjelpemidler. Har du sjekket filtrene dine?</BodyLong>
      </Alert>
    )
  }

  const shownNonAgreementProducts = nonAgreementGroup?.products.slice(0, nonAgreementShowCount) ?? []

  const showMoreAvailableCount = Math.min(SHOW_MORE_SIZE, totalNonAgreementProducts - nonAgreementShowCount)

  const totalVisibleProducts = products.length - totalNonAgreementProducts + shownNonAgreementProducts.length

  return (
    <VStack gap="space-16">
      <CompareMenu />
      <BodyShort>{`Viser ${totalVisibleProducts} av ${products.length} hjelpemidler`}</BodyShort>
      <VStack gap={'space-40'}>
        {Object.entries(delkontraktGroups)
          .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
          .filter(([delkontraktName]) => delkontraktName !== 'Ikke på avtale')
          .map(([delkontraktName, delkontraktGroup]) => (
            <DelkontraktGroup
              title={delkontraktGroup.title}
              refNr={delkontraktGroup.refNr}
              products={delkontraktGroup.products}
              handleCompareClick={handleCompareClick}
              key={delkontraktName}
            />
          ))}
        {nonAgreementGroup && (
          <DelkontraktGroup
            title={nonAgreementGroup.title}
            refNr={nonAgreementGroup.refNr}
            products={nonAgreementGroup.products.slice(0, nonAgreementShowCount)}
            handleCompareClick={handleCompareClick}
          />
        )}
      </VStack>
      {nonAgreementShowCount < totalNonAgreementProducts && (
        <Button
          variant="tertiary"
          size="medium"
          icon={<ChevronDownIcon aria-hidden />}
          iconPosition={'right'}
          onClick={() => setNonAgreementShowCount((prev) => prev + showMoreAvailableCount)}
          style={{ alignSelf: 'center' }}
        >
          Vis {showMoreAvailableCount} flere treff
        </Button>
      )}
    </VStack>
  )
}

const DelkontraktGroup = ({
  title,
  refNr,
  products,
  handleCompareClick,
}: {
  title: string
  refNr: string
  products: Product[]

  handleCompareClick: () => void
}) => {
  return (
    <VStack gap={'space-16'} style={{ borderTop: '1px solid #CFD3D8' }}>
      <HStack gap={'space-8'} align={'center'} paddingBlock={'space-16 space-0'}>
        {refNr !== '0' && (
          <Tag size={'medium'} data-color={'info'} variant={'moderate'}>
            På avtale
          </Tag>
        )}
        <Heading size={'small'}>{title}</Heading>
      </HStack>
      <HStack gap={{ xs: 'space-16', md: 'space-20' }}>
        {products.map((product) => (
          <ProductCardCategory key={product.id} product={product} handleCompareClick={handleCompareClick} />
        ))}
      </HStack>
    </VStack>
  )
}

type ProductsDelkontrakt = {
  [key: string]: {
    refNr: string
    title: string
    products: Product[]
  }
}

const groupByDelkontrakt = (products: Product[] | undefined): ProductsDelkontrakt => {
  const productsByDelkonktrakt: ProductsDelkontrakt = {}

  products?.forEach((product) => {
    if (product.agreements.length === 0) {
      if (!productsByDelkonktrakt['Ikke på avtale']) {
        productsByDelkonktrakt['Ikke på avtale'] = { refNr: '0', title: 'Ikke på avtale', products: [] }
      }

      productsByDelkonktrakt['Ikke på avtale'].products.push(product)
    }

    product.agreements.forEach((agreement) => {
      const delkontrakt = agreement.postTitle!
      const normalizedTitle = delkontrakt.split(/[):.]\s*/)

      if (delkontrakt !== null) {
        if (!productsByDelkonktrakt[delkontrakt]) {
          productsByDelkonktrakt[delkontrakt] = { refNr: agreement.refNr!, title: normalizedTitle[1], products: [] }
        }

        productsByDelkonktrakt[delkontrakt].products.push(product)
      }
    })
  })

  return productsByDelkonktrakt
}
