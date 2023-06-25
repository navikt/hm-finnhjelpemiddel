'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Agreement, getPostTitle } from '@/utils/agreement-util'
import { smallImageLoader } from '@/utils/image-util'
import { Product } from '@/utils/product-util'

import AgreementIcon from '@/components/AgreementIcon'
import { Alert, BodyShort, Heading, ImageIcon } from '@/components/aksel-client'
import DefinitionList from '@/components/definition-list/DefinitionList'

type AgreementInfoProps = {
  product: Product
  productsOnPost: Product[] | null
  agreement: Agreement
}

export const AgreementInfo = ({ product, agreement, productsOnPost }: AgreementInfoProps) => {
  const postTitle =
    product.agreementInfo?.postNr && agreement ? getPostTitle(agreement.posts, product.agreementInfo.postNr) : ''

  return (
    <section className="agreement-details">
      <div className="agreement-details__content max-width">
        <Heading level="3" size="large" id="agreement-info">
          Avtale med Nav
        </Heading>

        {product.agreementInfo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AgreementIcon rank={product.agreementInfo.rank} />
            <BodyShort>Rangert som nr. {product.agreementInfo.rank}</BodyShort>
          </div>
        )}
        <DefinitionList>
          <DefinitionList.Term>Avtale</DefinitionList.Term>
          <DefinitionList.Definition>{agreement.title}</DefinitionList.Definition>
          <DefinitionList.Term>Delkontrakt</DefinitionList.Term>
          <DefinitionList.Definition>{postTitle}</DefinitionList.Definition>
        </DefinitionList>
        {product.agreementInfo && product.agreementInfo.rank > 1 && (
          <Alert variant="warning" inline>
            Den er rangert som nummer {product.agreementInfo.rank} i delkontrakten. Ta en titt på høyere rangerte
            produkter for å se om det passer ditt behov.
          </Alert>
        )}
        {productsOnPost && productsOnPost.length > 1 && (
          <div className="product-info__products-on-post">
            <Heading level="4" size="medium" spacing>
              Andre produkter på samme delkontrakt
            </Heading>
            <div className="product-info__products-on-post-list">
              {productsOnPost.map((product) => (
                <div className="product-card" key={product.id}>
                  <div className="product-card__image">
                    <div className="image">
                      {product.photos.length === 0 && (
                        <ImageIcon
                          width="100%"
                          height="100%"
                          style={{ background: 'white' }}
                          aria-label="Ingen bilde tilgjengelig"
                        />
                      )}
                      {product.photos.length !== 0 && (
                        <Image
                          loader={smallImageLoader}
                          src={product.photos.at(0)?.uri || ''}
                          alt="Produktbilde"
                          fill
                          style={{ objectFit: 'contain' }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="info">
                    <Link className="search-result__link" href={`/produkt/${product.id}`}>
                      <Heading size="xsmall" className="product-card__product-title">
                        {product.title}
                      </Heading>
                    </Link>
                    {product.agreementInfo && <AgreementIcon rank={product.agreementInfo.rank} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
