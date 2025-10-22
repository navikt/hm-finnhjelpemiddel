'use client'

import { Heading } from '@/components/aksel-client'
import styles from '../AlternativeProducts.module.scss'
import { Bleed, BodyShort, Box, HStack, Loader, Search, VStack } from '@navikt/ds-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { mapToAlternativeProduct } from '@/app/gjenbruksprodukter/AlternativeProductsList'
import { EditableAlternativeGroup } from '@/app/gjenbruksprodukter/rediger/EditableAlternativeGroup'
import { AlternativeProduct, getAlternativesAndStock } from '@/app/gjenbruksprodukter/alternative-util'
import useSWRImmutable from 'swr/immutable'
import { Product } from '@/utils/product-util'
import { getProductFromHmsArtNrs } from '@/utils/api-util'

export default function EditAlternativeProductsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSearch = (value: string) => {
    router.push(`${pathname}?hms=${value}`)
  }

  if (
    typeof window !== 'undefined' &&
    !(
      window.location.href.startsWith('https://finnhjelpemiddel.ansatt') ||
      window.location.href.startsWith('http://localhost')
    )
  ) {
    return <div>ikke tilgang</div>
  }

  return (
    <VStack gap={'4'} className={`${styles.container} main-wrapper--large`}>
      <Bleed marginInline="full" reflectivePadding style={{ backgroundColor: '#F5F9FF' }}>
        <VStack paddingBlock={'12'}>
          <Heading level="1" size="large" spacing>
            Rediger alternativer
          </Heading>

          <Box paddingBlock={'0 8'}>
            <BodyShort spacing>Søk opp et hms-nummer til klyngen med alternativer du vil redigere</BodyShort>
          </Box>

          <HStack gap={'7'} align={'end'} wrap={false}>
            <Search
              label={'HMS-nummer'}
              hideLabel={false}
              variant="primary"
              className={styles.search}
              onSearchClick={(value) => handleSearch(value)}
              onKeyUp={(event: React.KeyboardEvent) => {
                if (event.key === 'Enter') {
                  handleSearch((event.currentTarget as HTMLInputElement).value)
                }
              }}
            ></Search>
          </HStack>
        </VStack>
      </Bleed>

      {searchParams.has('hms') && <AlternativeGroupList hmsNumber={searchParams.get('hms')!} />}
    </VStack>
  )
}

const AlternativeGroupList = ({ hmsNumber }: { hmsNumber: string }) => {
  const {
    data: alternativesResponse,
    isLoading: isLoadingAlternatives,
    error: errorAlternatives,
    mutate: mutateAlternatives,
  } = useSWRImmutable(`asdasd-${hmsNumber}`, () => getAlternativesAndStock(hmsNumber))

  const alternativeStocks = alternativesResponse?.alternatives
  const hmsArtNrs = alternativeStocks?.map((alternativeStock) => alternativeStock.hmsArtNr) ?? []

  const {
    data: alternativeProductsResponse,
    isLoading: isLoadingAlternativeProducts,
    error: errorAlternativeProducts,
  } = useSWRImmutable<Product[]>(
    alternativesResponse ? [`alternatives-${hmsNumber}`, alternativesResponse] : null,
    () => getProductFromHmsArtNrs(hmsArtNrs)
  )

  const {
    data: originalProductResponse,
    isLoading: isLoadingOriginalProduct,
    error: errorOriginalProduct,
  } = useSWRImmutable<Product[]>(hmsNumber, () => getProductFromHmsArtNrs([hmsNumber]))

  if (errorAlternatives || errorAlternativeProducts || errorOriginalProduct) {
    return <>En feil har skjedd ved henting av data</>
  }

  if (isLoadingAlternatives || isLoadingAlternativeProducts || isLoadingOriginalProduct) {
    return <Loader />
  }

  if (!originalProductResponse || originalProductResponse.length === 0) {
    return <>Finner ikke produkt {hmsNumber}</>
  }

  const original = mapToAlternativeProduct(originalProductResponse[0], alternativesResponse?.original.warehouseStock)

  const alternatives: AlternativeProduct[] =
    alternativeProductsResponse?.map((product) => {
      const stocks = alternativeStocks!.find((alt) => alt.hmsArtNr === product.variants[0].hmsArtNr)?.warehouseStock!
      return mapToAlternativeProduct(product, stocks)
    }) ?? []

  return <EditableAlternativeGroup alternatives={[original, ...alternatives]} />
}
