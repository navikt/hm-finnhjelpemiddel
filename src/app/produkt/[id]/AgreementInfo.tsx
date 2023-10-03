'use client'

import NextLink from 'next/link'

import { Product } from '@/utils/product-util'

import ProductCard from '@/components/ProductCard'
import { Alert, BodyLong, ChevronRightIcon, Heading, ImageIcon } from '@/components/aksel-client'

type AgreementInfoProps = {
  product: Product
  productsOnPost: Product[] | null
}

export const AgreementInfo = ({ product, productsOnPost }: AgreementInfoProps) => {
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

        <div className="agreement-details__products-on-post">
          <Heading level="4" size="medium" spacing>
            Andre produkter på samme delkontrakt
          </Heading>
          {productsOnPost && productsOnPost.length > 0 ? (
            <div className="agreement-details__products-on-post-list">
              {productsOnPost?.map((product) => (
                <ProductCard key={product.id} product={product} showRank={true} />
              ))}
            </div>
          ) : (
            <BodyLong>Det finnes ingen andre produkter på samme delkontrakt</BodyLong>
          )}
          <div className="agreement-details__agreement-link spacing-top--small">
            <BodyLong>
              <NextLink href={`/rammeavtale/${product.applicableAgreementInfo?.id}`} className="link">
                Les mer om {product.applicableAgreementInfo?.title}
                <ChevronRightIcon aria-hidden fontSize={'1.5rem'} />
              </NextLink>
            </BodyLong>
          </div>
        </div>
      </div>
    </section>
  )
}
