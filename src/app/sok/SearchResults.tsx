import React, { RefObject, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import Image from 'next/image'
import Link from 'next/link'

import { Next } from '@navikt/ds-icons'
import { Alert, BodyShort, Button, Checkbox, Heading, Loader } from '@navikt/ds-react'

import { FetchResponse, PAGE_SIZE, SearchData } from '@/utils/api-util'
import { CompareMenuState, useHydratedCompareStore } from '@/utils/compare-state-util'
import { smallImageLoader } from '@/utils/image-util'
import { Product } from '@/utils/product-util'

import useRestoreScroll from '@/hooks/useRestoreScroll'

import AgreementIcon from '@/components/AgreementIcon'
import DefinitionList from '@/components/definition-list/DefinitionList'

const SearchResults = ({
  data,
  page,
  setPage,
  isLoading,
}: {
  page: number
  setPage: (p: number) => void
  isLoading: boolean
  data?: Array<FetchResponse>
  productViewToggleRef: RefObject<HTMLButtonElement>
}) => {
  const products = data?.flatMap((d) => d.products)
  const [firstChecked, setFirstChecked] = useState<boolean>(true)

  useRestoreScroll('search-results', !isLoading)

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

  const isLoadingMore = !data || (page > 0 && typeof data[page - 1] === 'undefined')
  const isLastPage =
    (data?.at(-1)?.numberOfProducts || 0) - products.length === 0 ||
    (!isLoadingMore && products.length < page * PAGE_SIZE)

  return (
    <>
      <header className="results__header">
        <div className="flex flex--row flex--space-between">
          <Heading level="2" size="medium">
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
      {!isLastPage && (
        <Button variant="secondary" onClick={() => setPage(page + 1)} loading={isLoadingMore}>
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
            {product.agreementInfo?.rank && (
              <div className="search-result__rank-container">
                <AgreementIcon rank={product.agreementInfo?.rank} size="small" />
              </div>
            )}
          </div>
          <div className="search-result__description">
            <div className="search-result__post-container">
              {product.agreementInfo?.rank && <AgreementIcon rank={product.agreementInfo?.rank} />}
              <BodyShort>
                {'Dk ' + product.agreementInfo?.postNr + ': ' + product.agreementInfo?.postTitle ??
                  product.attributes?.text}
              </BodyShort>
            </div>
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

  if (!loadingError) {
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
      ></Image>
    )
  }
}

export default SearchResults