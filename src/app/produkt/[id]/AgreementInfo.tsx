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
    product.applicableAgreementInfo?.postNr && agreement
      ? getPostTitle(agreement.posts, product.applicableAgreementInfo.postNr)
      : ''

  return (
    <section className="agreement-details" aria-label="Informasjon om rammeavtalen produktet er på">
      <div className="agreement-details__content max-width">
        <Heading level="3" size="large" id="agreement-info">
          Avtale med Nav
        </Heading>

        {product.applicableAgreementInfo && product.applicableAgreementInfo.rank > 1 && (
          <Alert variant="info" inline>
            Dette produktet er rangert som nummer {product.applicableAgreementInfo.rank} i delkontrakten. Ta en titt på
            høyere rangerte produkter for å se om det passer ditt behov.
          </Alert>
        )}
        {productsOnPost && productsOnPost.length > 1 && (
          <div className="agreement-details__products-on-post">
            <Heading level="4" size="medium" spacing>
              Andre produkter på samme delkontrakt
            </Heading>
            <div className="agreement-details__products-on-post-list">
              {productsOnPost.map((product) => (
                <div className="agreement-details__product-on-post" key={product.id}>
                  <div className="image-container">
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
                    <Link className="link" href={`/produkt/${product.id}`}>
                      <Heading size="xsmall" className="text-line-clamp">
                        {product.title}
                      </Heading>
                    </Link>
                    {product.applicableAgreementInfo && <AgreementIcon rank={product.applicableAgreementInfo.rank} />}
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
