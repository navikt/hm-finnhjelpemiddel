import React, { useState } from 'react'
import Image from 'next/image'
import { Heading, BodyLong, Button, Checkbox } from '@navikt/ds-react'
import { Next, Picture } from '@navikt/ds-icons'
import { Product } from '../utils/product-util'
import { getIsoCategoryName } from '../utils/iso-category-util'
import { useHydratedPCStore, useSearchDataStore, CompareMode } from '../utils/state-util'
import DefinitionList from './produkt/[id]/DefinitionList'

type ProduktProps = {
  product: Product
}

const SearchResult = ({ product }: ProduktProps) => {
  const { setSearchData } = useSearchDataStore()
  const { compareMode, setProductToCompare, removeProduct, productsToCompare } = useHydratedPCStore()

  const hasImage = product.photos.length !== 0
  const [firstImageSrc] = useState(product.photos.at(0)?.uri || '')

  const imageLoader = ({ src }: { src: string }) => {
    return `https://www.hjelpemiddeldatabasen.no/blobs/snet/${src}`
  }

  const handlechange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    event.currentTarget.value ? setProductToCompare(product) : removeProduct(product)
  }

  const isInProductsToCompare = productsToCompare.filter((procom) => product.id === procom.id).length >= 1

  return (
    <li className="search-result">
      <div className="search-result__container">
        {compareMode === CompareMode.Acitve && (
          <div className="search-result__compare-checkbox">
            <Checkbox
              hideLabel
              value="Sammenlikn dette produkt"
              onChange={handlechange}
              checked={isInProductsToCompare}
            >
              Sammenlikn
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
              <a className="search-result__link" href={`/produkt/${product.id}`}>
                {product.title}
              </a>
            </Heading>
          </div>
          <div className="search-result__description">
            <BodyLong>{product.description?.short}</BodyLong>
          </div>
          <div className="search-result__more-info">
            <DefinitionList>
              <DefinitionList.Term>HMS-nr.</DefinitionList.Term>
              <DefinitionList.Definition>{product.hmsNr}</DefinitionList.Definition>
              <DefinitionList.Term>Produktkategori</DefinitionList.Term>
              <DefinitionList.Definition>
                <Button
                  className="search-result__product-category-button"
                  variant="tertiary"
                  size="small"
                  onClick={() => setSearchData({ isoCode: product.isoCode })}
                >
                  {getIsoCategoryName(product.isoCode)}
                </Button>
              </DefinitionList.Definition>
            </DefinitionList>
          </div>
        </div>
        <Next className="search-result__chevron" aria-hidden />
      </div>
    </li>
  )
}

export default SearchResult
