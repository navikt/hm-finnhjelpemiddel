import Link from 'next/link'
import Image from 'next/image'
import { RefObject, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Heading, BodyLong, Button, Checkbox, BodyShort, Alert, Loader } from '@navikt/ds-react'
import { Next, Picture, Up } from '@navikt/ds-icons'
import { Product } from '../../utils/product-util'
import { getIsoCategoryName } from '../../utils/iso-category-util'
import { CompareMenuState, CompareMode, useHydratedCompareStore } from '../../utils/compare-state-util'
import { useHydratedSearchStore } from '../../utils/search-state-util'
import { FetchResponse } from '../../utils/api-util'

import DefinitionList from '../definition-list/DefinitionList'
import useRestoreScroll from '../../hooks/useRestoreScroll'

const SearchResults = ({
  data,
  size,
  setSize,
  isLoading,
  compareButtonRef,
}: {
  size: number
  setSize: (size: (s: number) => number) => void
  isLoading: boolean
  data?: Array<FetchResponse>
  compareButtonRef: RefObject<HTMLButtonElement>
}) => {
  const { ref: pageTopRef, inView: isAtPageTop } = useInView({ threshold: 0.4 })
  const { compareMode, setCompareMode, setCompareMenuState } = useHydratedCompareStore()
  const products = data?.flatMap((d) => d.products)

  useRestoreScroll('search-results', !isLoading)

  const comparingButton =
    compareMode === CompareMode.Deactivated ? (
      <Button
        ref={compareButtonRef}
        size="small"
        variant="secondary"
        onClick={() => {
          setCompareMode(CompareMode.Active)
          setCompareMenuState(CompareMenuState.Open)
        }}
      >
        Sammenlign produkter
      </Button>
    ) : (
      <Button
        ref={compareButtonRef}
        size="small"
        variant="primary"
        aria-pressed
        onClick={() => setCompareMode(CompareMode.Deactivated)}
      >
        Sammenlign produkter
      </Button>
    )

  if (isLoading) {
    return (
      <>
        <Heading level="2" size="medium">
          Søkeresultater
        </Heading>

        <div id="searchResults">
          <Loader className="results__loader" size="3xlarge" title="Laster produkter" />
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
        <div>
          <Heading level="2" size="medium">
            Søkeresultater
          </Heading>
          <BodyShort ref={pageTopRef} aria-live="polite">{`${products.length} av ${
            data?.at(-1)?.numberOfProducts
          } produkter vises`}</BodyShort>
        </div>
        {comparingButton}
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
      {!isAtPageTop && (
        <Button
          type="button"
          className="search__page-up-button"
          icon={<Up title="Gå til toppen av siden" />}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Til toppen
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
        <div className="search-result__compare-checkbox">
          <Checkbox
            size="small"
            value="Sammenlign dette produkt"
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
            <Picture width={150} height="auto" style={{ background: 'white' }} aria-label="Ingen bilde tilgjengelig" />
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
              {compareMode === CompareMode.Deactivated && (
                <Link className="search-result__link search-result__link__underline" href={`/produkt/${product.id}`}>
                  {product.title}
                </Link>
              )}

              {compareMode === CompareMode.Active && (
                <button className="search-result__link__button" onClick={toggleCompareProduct}>
                  {product.title}
                </button>
              )}
            </Heading>
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
                  {getIsoCategoryName(product.isoCategory)}
                </Button>
              </DefinitionList.Definition>
              <DefinitionList.Term>Bestillingsordning</DefinitionList.Term>
              <DefinitionList.Definition>
                {product.attributes.bestillingsordning ? 'Ja' : 'Nei'}
              </DefinitionList.Definition>
            </DefinitionList>
          </div>
        </div>
        <div className="search-result__chevron-container">
          {compareMode === CompareMode.Deactivated && <Next className="search-result__chevron" aria-hidden />}
        </div>
      </div>
    </li>
  )
}

export default SearchResults
