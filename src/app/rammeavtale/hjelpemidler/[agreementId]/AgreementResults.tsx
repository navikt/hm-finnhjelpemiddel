'use client'

import ProductCard from '@/components/ProductCard'
import { PostWithProducts } from '@/utils/agreement-util'
import { FormSearchData } from '@/utils/search-state-util'
import { ImageIcon, PrinterSmallIcon } from '@navikt/aksel-icons'
import { Alert, Button, HStack, Heading, Loader, Show, ToggleGroup, VStack } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import { RefObject } from 'react'
import { useFormContext } from 'react-hook-form'

const AgreementResults = ({
  posts,
  formRef,
  postLoading,
}: {
  posts: PostWithProducts[]
  formRef: RefObject<HTMLFormElement>
  postLoading: boolean
}) => {
  const formMethods = useFormContext<FormSearchData>()
  const searchParams = useSearchParams()
  const pictureToggleValue = searchParams.get('hidePictures') ?? 'show-pictures'

  const handleSetToggle = (value: string) => {
    formMethods.setValue('hidePictures', value)
    formRef.current?.requestSubmit()
  }

  const handleSetIsoFilter = (value: string) => {
    formMethods.setValue(`filters.produktkategori`, [value])
    formRef.current?.requestSubmit()
  }

  return (
    <VStack gap={{ xs: '4' }}>
      <HStack justify="space-between">
        <Show above="md">
          <Heading level="2" size="small">
            Delkontrakter
          </Heading>
        </Show>
        <HStack gap="4">
          <ToggleGroup
            className="picture-toggle"
            defaultValue="show-pictures"
            onChange={handleSetToggle}
            value={pictureToggleValue}
            size="small"
            variant="neutral"
          >
            <ToggleGroup.Item value="show-pictures">
              <ImageIcon aria-hidden />
              Vis bilde
            </ToggleGroup.Item>
            <ToggleGroup.Item value="hide-pictures">Uten bilde</ToggleGroup.Item>
          </ToggleGroup>
          <Button
            size="small"
            variant="secondary-neutral"
            onClick={() => {
              window.print()
            }}
            icon={<PrinterSmallIcon title="Pdf-oversikt" fontSize="1.5rem" />}
          >
            PDF-oversikt
          </Button>
        </HStack>
      </HStack>
      <VStack
        as="ol"
        gap={{ xs: '4', md: pictureToggleValue === 'hide-pictures' ? '4' : '6' }}
        className="agreement-search-results"
        id="agreementSearchResults"
      >
        {posts.map((post) => (
          <VStack
            as="li"
            key={post.nr}
            className="agreement-post"
            gap={{ xs: '2', md: pictureToggleValue === 'hide-pictures' ? '2' : '4' }}
          >
            <Heading
              level="3"
              size="xsmall"
              className={pictureToggleValue === 'hide-pictures' ? 'spacing-top--xsmall' : 'spacing-top--small'}
            >
              {post.title}
            </Heading>
            {post.products.length === 0 && postLoading && (
              <HStack justify="center" style={{ marginTop: '18px' }}>
                <Loader size="medium" title="Laster hjelpemidler" />
              </HStack>
            )}
            {post.products.length === 0 && !postLoading && (
              <Alert variant="info">Delkontrakten inneholder ingen hjelpemidler</Alert>
            )}
            <HStack as="ol" gap={'4'}>
              {post.products.map((productWithRank) => (
                <li key={productWithRank.product.id}>
                  <ProductCard
                    key={`${productWithRank.product.id} + ${productWithRank.rank}`}
                    product={productWithRank.product}
                    rank={productWithRank.rank}
                    type={pictureToggleValue === 'hide-pictures' ? 'no-picture' : 'checkbox'}
                    handleIsoButton={handleSetIsoFilter}
                  />
                </li>
              ))}
            </HStack>
          </VStack>
        ))}
      </VStack>
      {posts.length === 0 && <Alert variant="info">Obs! Fant ingen hjelpemiddel. Har du sjekket filtrene dine?</Alert>}
    </VStack>
  )
}

export default AgreementResults