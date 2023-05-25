import React, { RefObject, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Alert, BodyLong, BodyShort, Button, Checkbox, Heading, Loader, ToggleGroup } from '@navikt/ds-react'
import { Next } from '@navikt/ds-icons'
import { ImageIcon } from '@navikt/aksel-icons'
import { Product } from '@/utils/product-util'
import { CompareMode, useHydratedCompareStore } from '@/utils/compare-state-util'
import { useHydratedSearchStore } from '@/utils/search-state-util'
import { FetchResponse, PAGE_SIZE } from '@/utils/api-util'
import { capitalize } from '@/utils/string-util'
import { FilterCategories } from '@/utils/filter-util'
import { smallImageLoader } from '@/utils/image-util'
import { sortAlphabetically } from '@/utils/sort-util'
import useRestoreScroll from '@/hooks/useRestoreScroll'

import DefinitionList from '@/components/definition-list/DefinitionList'
import ShowMore from '@/components/ShowMore'

const SearchResults = ({
  data,
  size,
  setSize,
  isLoading,
  productViewToggleRef,
}: {
  size: number
  setSize: (size: (s: number) => number) => void
  isLoading: boolean
  data?: Array<FetchResponse>
  productViewToggleRef: RefObject<HTMLButtonElement>
}) => {
  const {
    meta: { showProductSeriesView },
    setShowProductSeriesView,
  } = useHydratedSearchStore()
  const { setCompareMode } = useHydratedCompareStore()
  const products = data?.flatMap((d) => d.products)
  const totalNumberOfProducts = data?.at(-1)?.numberOfProducts

  useRestoreScroll('search-results', !isLoading)

  useEffect(() => {
    if (showProductSeriesView) {
      setCompareMode(CompareMode.Inactive)
    } else {
      setCompareMode(CompareMode.Active)
    }
  }, [showProductSeriesView, setCompareMode])

  if (isLoading) {
    return (
      <>
        <Heading level="2" size="medium">
          Søkeresultater
        </Heading>

        <div id="searchResults" className="results__loader">
          <Loader size="3xlarge" title="Laster produkter" />
        </div>
      </>
    )
  }

  if (!products?.length) {
    return (
      <>
        <Heading level="2" size="medium">
          Søkeresultater
        </Heading>
        <div id="searchResults">
          <Alert variant="info" fullWidth>
            Ingen produkter funnet.
          </Alert>
        </div>
      </>
    )
  }

  const isLoadingMore = !data || (size > 0 && typeof data[size - 1] === 'undefined')
  const isLastPage =
    (data?.at(-1)?.numberOfProducts || 0) - products.length === 0 ||
    (showProductSeriesView && !isLoadingMore && products.length < size * PAGE_SIZE)

  return (
    <>
      <header className="results__header">
        <div className="flex flex--row flex--space-between">
          <Heading level="2" size="medium">
            Søkeresultater
          </Heading>
          <ToggleGroup
            className="view-toggle"
            value={showProductSeriesView ? 'series' : 'products'}
            onChange={(value) => setShowProductSeriesView(value === 'series')}
            size="small"
            variant="neutral"
          >
            <ToggleGroup.Item value="series" ref={productViewToggleRef}>
              Produktserier
            </ToggleGroup.Item>
            <ToggleGroup.Item value="products">Enkeltprodukter</ToggleGroup.Item>
          </ToggleGroup>
        </div>
        <div>
          <BodyShort aria-live="polite">
            {showProductSeriesView
              ? `${products.length} produktserier vises`
              : `${products.length} av ${totalNumberOfProducts} produkter vises`}
          </BodyShort>
        </div>
      </header>
      <ol className="results__list" id="searchResults">
        {products.map((product) => (
          <SearchResult key={product.id} product={product} />
        ))}
      </ol>
      {!isLastPage && (
        <Button variant="secondary" onClick={() => setSize((s) => s + 1)} loading={isLoadingMore}>
          Vis flere treff
        </Button>
      )}
    </>
  )
}

const SearchResult = ({ product }: { product: Product }) => {
  const {
    setFilter,
    meta: { showProductSeriesView },
  } = useHydratedSearchStore()
  const { compareMode, setProductToCompare, removeProduct, productsToCompare } = useHydratedCompareStore()
  const productFilters = Object.entries(product.filters)
  const [firstImageSrc] = useState(product.photos.at(0)?.uri || '')

  const toggleCompareProduct = () => {
    productsToCompare.filter((procom: Product) => product.id === procom.id).length === 1
      ? removeProduct(product)
      : setProductToCompare(product)
  }

  const isInProductsToCompare = productsToCompare.filter((procom: Product) => product.id === procom.id).length >= 1
  const showSpecsButton = !showProductSeriesView && productFilters.length > 0

  return (
    <li className="search-result">
      {compareMode === CompareMode.Active && (
        <div className="search-result__header">
          <Checkbox
            size="small"
            value="Legg produktet til sammenligning"
            onChange={toggleCompareProduct}
            checked={isInProductsToCompare}
          >
            Sammenlign
          </Checkbox>
        </div>
      )}
      <div className="search-result__container">
        <div className="search-result__image">
          <ProductImage src={firstImageSrc} />
        </div>
        <div className="search-result__content">
          <div className="search-result__title">
            <Heading level="3" size="medium">
              <Link className="search-result__link" href={`/produkt/${product.id}`}>
                {showProductSeriesView ? product.title : product.articleName}
              </Link>
            </Heading>
            {product.agreementInfo && (
              <div className="search-result__post-and-rank-container">
                <div className="search-result__post-and-rank">
                  <span>Rangering</span>
                  <span className="search-result__post-and-rank__rank">{product.agreementInfo?.rank}</span>
                </div>
              </div>
            )}
          </div>
          <div className="search-result__description">
            <BodyLong>{product.agreementInfo?.postTitle ?? product.attributes?.text}</BodyLong>
          </div>
          <div className="search-result__more-info">
            <DefinitionList>
              {!showProductSeriesView && (
                <>
                  <DefinitionList.Term>HMS-nr.</DefinitionList.Term>
                  <DefinitionList.Definition>{product.hmsArtNr ? product.hmsArtNr : '–'}</DefinitionList.Definition>
                </>
              )}
              <DefinitionList.Term>Produktkategori</DefinitionList.Term>
              <DefinitionList.Definition>
                <Button
                  className="search-result__product-category-button"
                  variant="tertiary"
                  size="small"
                  onClick={() => {
                    setFilter('produktkategori', [product.isoCategoryTitle])
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  {product.isoCategoryTitle}
                </Button>
              </DefinitionList.Definition>
            </DefinitionList>

            {showSpecsButton && (
              <ShowMore title="Spesifikasjoner">
                <DefinitionList>
                  {productFilters
                    .sort(([keyA], [keyB]) => sortAlphabetically(keyA, keyB))
                    .map(([key, value]) => (
                      <>
                        <DefinitionList.Term>
                          {FilterCategories[key as keyof typeof FilterCategories]}
                        </DefinitionList.Term>
                        <DefinitionList.Definition>{capitalize(String(value))}</DefinitionList.Definition>
                      </>
                    ))}
                </DefinitionList>
              </ShowMore>
            )}
          </div>
        </div>
        <div className="search-result__chevron-container">
          <Next className="search-result__chevron" aria-hidden />
        </div>
      </div>
    </li>
  )
}

const ProductImage = ({ src }: { src: string }) => {
  const [isLoading, setIsLoading] = useState(true)

  if (src) {
    return (
      <>
        {isLoading && <Loader size="large" />}
        <Image
          loader={smallImageLoader}
          src={src}
          onLoad={() => setIsLoading(true)}
          onLoadingComplete={() => setIsLoading(false)}
          alt="Produktbilde"
          fill
          style={{ objectFit: 'contain', opacity: !isLoading ? 1 : 0 }}
          sizes="50vw"
          priority
        />
      </>
    )
  }

  return <ImageIcon width="100%" height="100%" style={{ background: 'white' }} aria-label="Ingen bilde tilgjengelig" />
}

export default SearchResults
