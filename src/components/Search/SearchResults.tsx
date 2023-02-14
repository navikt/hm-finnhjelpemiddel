import React, { useState } from 'react'
import Image from 'next/image'
import { Heading, BodyLong, Button, Checkbox, BodyShort, Alert, Loader } from '@navikt/ds-react'
import { Next, Picture } from '@navikt/ds-icons'
import { Product } from '../../utils/product-util'
import { getIsoCategoryName } from '../../utils/iso-category-util'
import { useHydratedCompareStore, useSearchDataStore, CompareMode } from '../../utils/state-util'
import DefinitionList from '../DefinitionList/DefinitionList'
import { FetchResponse, PAGE_SIZE } from '../../utils/api-util'

type ProduktProps = {
  product: Product
}

const SearchResults = ({
  data,
  size,
  setSize,
  isLoading,
}: {
  size: number
  setSize: (size: number) => void
  isLoading: boolean
  data?: Array<FetchResponse>
}) => {
  const { setCompareMode, compareMode, setCompareMenuState } = useHydratedCompareStore()
  const products = data?.flatMap((d) => d.products)
  const isLoadingMore = !data || (size > 0 && typeof data[size - 1] === 'undefined')
  const isLastPage = data && data[data.length - 1]?.products.length < PAGE_SIZE

  const comparingButton =
    compareMode === CompareMode.Deactivated ? (
      <Button
        variant="secondary"
        onClick={() => {
          setCompareMode(CompareMode.Active) //, setCompareMenuState(CompareMenuState.Open)
        }}
      >
        Sammenlign produkter
      </Button>
    ) : (
      <Button variant="secondary" onClick={() => setCompareMode(CompareMode.Deactivated)}>
        Slå av sammenligning av produkter
      </Button>
    )

  if (isLoading) {
    return <Loader className="results__loader" size="3xlarge" title="Laster produkter" />
  }

  if (!products?.length) {
    return (
      <>
        <Heading level="2" size="medium">
          Søkeresultater
        </Heading>
        <Alert variant="info" fullWidth>
          Ingen produkter funnet.
        </Alert>
      </>
    )
  }
  return (
    <>
      <header className="results__header">
        <div>
          <Heading level="2" size="medium">
            Søkeresultater
          </Heading>
          <BodyShort>{`${products.length} av ${data?.at(-1)?.numberOfProducts} produkter vises`}</BodyShort>
        </div>
        {comparingButton}
      </header>
      <ol className="results__list">
        {products.map((product) => (
          <SearchResult key={product.id} product={product} />
        ))}
      </ol>
      {!isLastPage && (
        <Button variant="secondary" onClick={() => setSize(size + 1)} loading={isLoadingMore}>
          Vis flere treff
        </Button>
      )}
    </>
  )
}

const SearchResult = ({ product }: ProduktProps) => {
  const { setSearchData } = useSearchDataStore()
  const { compareMode, setProductToCompare, removeProduct, productsToCompare } = useHydratedCompareStore()

  const hasImage = product.photos.length !== 0
  const [firstImageSrc] = useState(product.photos.at(0)?.uri || '')

  const imageLoader = ({ src }: { src: string }) => {
    return `https://www.hjelpemiddeldatabasen.no/blobs/snet/${src}`
  }

  const toggleCompareProduct = () => {
    productsToCompare.filter((procom) => product.id === procom.id).length === 1
      ? removeProduct(product)
      : setProductToCompare(product)
  }

  const isInProductsToCompare = productsToCompare.filter((procom) => product.id === procom.id).length >= 1

  return (
    <li className="search-result">
      <div className="search-result__container">
        {compareMode === CompareMode.Active && (
          <div className="search-result__compare-checkbox">
            <Checkbox
              hideLabel
              value="Sammenlign dette produkt"
              onChange={toggleCompareProduct}
              checked={isInProductsToCompare}
            >
              Sammenlign
            </Checkbox>
          </div>
        )}
        <div className="search-result__image">
          {!hasImage && (
            <Picture width={150} height="auto" style={{ background: 'white' }} aria-label="Ingen bilde tilgjengelig" />
          )}
          {hasImage && (
            <Image loader={imageLoader} src={firstImageSrc} alt="Produktbilde" width="0" height="0" sizes="100vw" />
          )}
        </div>
        <div className="search-result__content">
          <div className="search-result__title">
            <Heading size="medium">
              {compareMode === CompareMode.Deactivated && (
                <a className="search-result__link" href={`/produkt/${product.id}`}>
                  {product.title}
                </a>
              )}
              {compareMode === CompareMode.Active && (
                <button className="search-result__link search-result__link__button" onClick={toggleCompareProduct}>
                  {product.title}
                </button>
              )}
            </Heading>
          </div>
          <div className="search-result__description">
            <BodyLong>{product.attributes?.text}</BodyLong>
          </div>
          <div className="search-result__more-info">
            <DefinitionList>
              <DefinitionList.Term>HMS-nr.</DefinitionList.Term>
              <DefinitionList.Definition>
                {product.hmsartNr ? product.hmsartNr : 'Mangler HMS-nr'}
              </DefinitionList.Definition>
              <DefinitionList.Term>Produktkategori</DefinitionList.Term>
              <DefinitionList.Definition>
                <Button
                  className="search-result__product-category-button"
                  variant="tertiary"
                  size="small"
                  onClick={() => setSearchData({ isoCode: product.isoCategory })}
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
        <Next className="search-result__chevron" aria-hidden />
      </div>
    </li>
  )
}

export default SearchResults
