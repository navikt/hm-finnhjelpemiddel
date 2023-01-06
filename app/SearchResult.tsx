import React, { useState } from 'react'
import Image from 'next/image'
import { Heading, BodyLong, Button } from '@navikt/ds-react'
import { Information, Next, Picture } from '@navikt/ds-icons'
import { Product } from '../utils/product-util'
import { getIsoCategoryName } from '../utils/iso-category-util'
import { useSearchDataStore } from '../utils/state-util'
import DefinitionList from './produkt/[id]/DefinitionList'

type ProduktProps = {
  product: Product
}

const SearchResult = ({ product }: ProduktProps) => {
  const { setSearchData } = useSearchDataStore()

  const hasImage = product.photos.length !== 0
  const [firstImageUrl] = useState(`https://www.hjelpemiddeldatabasen.no/blobs/orig/${product.photos.at(0)?.uri}`)

  return (
    <li className="search-result">
      <div className="search-result__container">
        <div className="search-result__image">
          {!hasImage && (
            <Picture width={150} height="auto" style={{ background: 'white' }} aria-label="Ingen bilde tilgjengelig" />
          )}
          {hasImage && <Image src={firstImageUrl} alt="Produktbilde" width="0" height="0" sizes="100vw" style={{}} />}
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
