import Link from 'next/link'
import Image from 'next/image'
import { RefObject, useEffect, useState } from 'react'
import { Alert, BodyLong, BodyShort, Button, Checkbox, Heading, Loader, ToggleGroup } from '@navikt/ds-react'
import { Next } from '@navikt/ds-icons'
import { ImageIcon } from '@navikt/aksel-icons'
import { Product } from '../../utils/product-util'
import { CompareMode, useHydratedCompareStore } from '../../utils/compare-state-util'
import { useHydratedSearchStore } from '../../utils/search-state-util'
import { FetchResponse } from '../../utils/api-util'
import useRestoreScroll from '../../hooks/useRestoreScroll'

import DefinitionList from '../definition-list/DefinitionList'

function getProductCategories(products?: Array<Product>) {
  return Object.entries(
    products?.reduce(
      (hash, obj) => ({
        ...hash,
        [obj.seriesId as string]: (hash[obj.seriesId as string] || []).concat(obj),
      }),
      {} as Record<string, Array<Product>>
    ) ?? {}
  ).map(([_, data]) => ({ seriesName: data.at(0)?.attributes.series || data.at(0)?.title, data }))
}

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

  useRestoreScroll('search-results', !isLoading)

  useEffect(() => {
    if (showProductSeriesView) {
      setCompareMode(CompareMode.Inactive)
    } else {
      setCompareMode(CompareMode.Active)
    }
  }, [showProductSeriesView, setCompareMode])

  const productCategories = getProductCategories(products)

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
  const isLastPage = (data?.at(-1)?.numberOfProducts || 0) - products.length === 0

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
            <ToggleGroup.Item value="series">Produktserier</ToggleGroup.Item>
            <ToggleGroup.Item value="products" ref={productViewToggleRef}>
              Enkeltprodukter
            </ToggleGroup.Item>
          </ToggleGroup>
        </div>
        <div>
          {showProductSeriesView && (
            <BodyShort aria-live="polite">{`${productCategories?.length} produktserier vises`}</BodyShort>
          )}
          {!showProductSeriesView && (
            <BodyShort aria-live="polite">{`${products.length} av ${
              data?.at(-1)?.numberOfProducts
            } produkter vises`}</BodyShort>
          )}
        </div>
      </header>
      <ol className="results__list" id="searchResults">
        {showProductSeriesView &&
          productCategories?.map((productCategory) => (
            <SearchResult
              key={productCategory.seriesName}
              product={{
                ...productCategory.data.at(0)!,
                title: productCategory.seriesName || products.at(0)?.title!,
              }}
            />
          ))}
        {!showProductSeriesView && products.map((product) => <SearchResult key={product.id} product={product} />)}
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
  const { setSearchData } = useHydratedSearchStore()
  const { compareMode, setProductToCompare, removeProduct, productsToCompare } = useHydratedCompareStore()

  const hasImage = product.photos.length !== 0
  const [firstImageSrc] = useState(product.photos.at(0)?.uri || '')

  const imageLoader = ({ src }: { src: string }) => {
    return `https://www.hjelpemiddeldatabasen.no/blobs/snet/${src}`
  }

  const toggleCompareProduct = () => {
    productsToCompare.filter((procom: Product) => product.id === procom.id).length === 1
      ? removeProduct(product)
      : setProductToCompare(product)
  }

  const isInProductsToCompare = productsToCompare.filter((procom: Product) => product.id === procom.id).length >= 1

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
          {!hasImage && (
            <ImageIcon
              width="100%"
              height="100%"
              style={{ background: 'white' }}
              aria-label="Ingen bilde tilgjengelig"
            />
          )}
          {hasImage && (
            <Image
              loader={imageLoader}
              src={firstImageSrc}
              alt="Produktbilde"
              fill
              style={{ objectFit: 'contain' }}
              sizes="50vw"
              priority
            />
          )}
        </div>
        <div className="search-result__content">
          <div className="search-result__title">
            <Heading level="3" size="medium">
              <Link className="search-result__link" href={`/produkt/${product.id}`}>
                {product.title}
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
            <BodyLong size="small">{product.attributes?.text}</BodyLong>
          </div>
          <div className="search-result__more-info">
            <DefinitionList>
              <DefinitionList.Term>HMS-nr.</DefinitionList.Term>
              <DefinitionList.Definition>
                {product.hmsArtNr ? product.hmsArtNr : 'Mangler HMS-nr'}
              </DefinitionList.Definition>
              <DefinitionList.Term>Produktkategori</DefinitionList.Term>
              <DefinitionList.Definition>
                <Button
                  className="search-result__product-category-button"
                  variant="tertiary"
                  size="small"
                  onClick={() => {
                    setSearchData({ isoCode: product.isoCategory })
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  {product.isoCategoryTitle}
                </Button>
              </DefinitionList.Definition>
            </DefinitionList>
          </div>
        </div>
        <div className="search-result__chevron-container">
          <Next className="search-result__chevron" aria-hidden />
        </div>
      </div>
    </li>
  )
}

export default SearchResults
