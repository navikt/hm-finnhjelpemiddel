import React, { RefObject, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import Image from 'next/image'
import Link from 'next/link'

import { Next } from '@navikt/ds-icons'
import { Alert, BodyShort, Button, Checkbox, Heading, Loader } from '@navikt/ds-react'

import { FetchResponse, SearchData } from '@/utils/api-util'
import { CompareMenuState, useHydratedCompareStore } from '@/utils/compare-state-util'
import { smallImageLoader } from '@/utils/image-util'
import { Product } from '@/utils/product-util'

import useRestoreScroll from '@/hooks/useRestoreScroll'

import AgreementIcon from '@/components/AgreementIcon'
import DefinitionList from '@/components/definition-list/DefinitionList'

const SearchResults = ({
  data,
  loadMore,
  isLoading,
  searchResultRef,
}: {
  loadMore?: () => void
  isLoading: boolean
  data?: Array<FetchResponse>
  searchResultRef: RefObject<HTMLHeadingElement>
}) => {
  const products = data?.map((d) => d.products).flat()

  const [firstChecked, setFirstChecked] = useState<boolean>(true)

  useRestoreScroll('search-results', !isLoading)

  if (!data) {
    return (
      <>
        <Heading level="2" size="medium" ref={searchResultRef}>
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
        <Heading level="2" size="medium" ref={searchResultRef}>
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

  return (
    <>
      <header className="results__header">
        <div className="flex flex--row flex--space-between">
          <Heading level="2" size="medium" ref={searchResultRef}>
            Søkeresultater
          </Heading>
        </div>
        <div>
          <BodyShort aria-live="polite">{`${products.length} produkter vises`}</BodyShort>
        </div>
      </header>
      <ol className="results__list" id="searchResults">
        {products.map((product) => (
          <SearchResult
            key={product.id}
            product={product}
            firstChecked={firstChecked}
            setFirstChecked={setFirstChecked}
          />
        ))}
      </ol>
      {loadMore && (
        <Button variant="secondary" onClick={loadMore} loading={isLoading}>
          Vis flere treff
        </Button>
      )}
    </>
  )
}

const SearchResult = ({
  product,
  firstChecked,
  setFirstChecked,
}: {
  product: Product
  firstChecked: boolean
  setFirstChecked: (first: boolean) => void
}) => {
  const { setProductToCompare, removeProduct, productsToCompare, setCompareMenuState } = useHydratedCompareStore()
  const { setValue } = useFormContext<SearchData>()

  const [firstImageSrc] = useState(product.photos.at(0)?.uri || '')

  const toggleCompareProduct = () => {
    productsToCompare.filter((procom: Product) => product.id === procom.id).length === 1
      ? removeProduct(product)
      : setProductToCompare(product)

    if (firstChecked) {
      setCompareMenuState(CompareMenuState.Open)
      setFirstChecked(false)
    }
  }

  const isInProductsToCompare = productsToCompare.filter((procom: Product) => product.id === procom.id).length >= 1

  return (
    <li className={isInProductsToCompare ? 'search-result checked' : 'search-result'}>
      <div className="search-result__compare-checkbox">
        <Checkbox
          size="small"
          value="Legg produktet til sammenligning"
          onChange={toggleCompareProduct}
          checked={isInProductsToCompare}
        >
          Sammenlign
        </Checkbox>
      </div>
      <div className="search-result__container">
        <div className="search-result__image">
          <ProductImage src={firstImageSrc} />
        </div>
        <div className="search-result__content">
          <div className="search-result__title">
            <Heading level="3" size="medium">
              <Link className="search-result__link" href={`/produkt/${product.id}`}>
                {product.title}
              </Link>
            </Heading>
            {product.applicableAgreementInfo?.rank && (
              <div className="search-result__rank-on-mobile">
                <AgreementIcon rank={product.applicableAgreementInfo?.rank} size="small" />
              </div>
            )}
          </div>
          <div className="search-result__description">
            {product.applicableAgreementInfo ? (
              <div className="search-result__post-container">
                <AgreementIcon rank={product.applicableAgreementInfo?.rank} />
                <BodyShort>
                  {'Dk ' +
                    product.applicableAgreementInfo?.postNr +
                    ': ' +
                    product.applicableAgreementInfo?.postTitle ?? product.attributes?.text}
                </BodyShort>
              </div>
            ) : (
              <div>{product.attributes.text ?? 'Produkt mangler beskrivelse'}</div>
            )}
          </div>
          <div className="search-result__more-info">
            <DefinitionList>
              <DefinitionList.Term>Produktkategori</DefinitionList.Term>
              <DefinitionList.Definition>
                <Button
                  className="search-result__product-category-button"
                  variant="tertiary"
                  size="small"
                  onClick={() => setValue(`filters.produktkategori`, [product.isoCategoryTitle])}
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

const ProductImage = ({ src }: { src: string }) => {
  const [loadingError, setLoadingError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  if (!loadingError && src !== '') {
    return (
      <>
        {isLoading && <Loader size="large" />}
        <Image
          loader={smallImageLoader}
          src={src}
          onLoad={() => setIsLoading(true)}
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => {
            setLoadingError(true)
            setIsLoading(false)
          }}
          alt="Produktbilde"
          fill
          style={{ objectFit: 'contain', opacity: !isLoading ? 1 : 0 }}
          sizes="50vw"
          priority
        />
      </>
    )
  } else {
    return (
      <Image
        src={'/assets/image-error.png'}
        alt="Produktbilde mangler"
        fill
        style={{ padding: '10px' }}
        sizes="50vw"
        priority
      />
    )
  }
}

export default SearchResults
