'use client'

import NextLink from 'next/link'

import { Product } from '@/utils/product-util'

import ProductCard from '@/components/ProductCard'
import { Alert, BodyLong, ChevronRightIcon, Heading, ImageIcon } from '@/components/aksel-client'
import { Bleed } from '@navikt/ds-react'
import { ProductsOnSamePost } from './page'

type AgreementInfoProps = {
  product: Product
  productsOnPosts: ProductsOnSamePost[]
}

export const AgreementInfoSection = ({ product, productsOnPosts }: AgreementInfoProps) => {
  return (
    <Bleed marginInline="full" asChild>
      <section
        className="agreement-details spacing-top--large"
        aria-label="Informasjon om rammeavtalen produktet er på"
      >
        <div className="agreement-details__content main-wrapper">
          <Heading level="3" size="large" id="agreement-info">
            Avtale med Nav
          </Heading>

          {product.applicableAgreementInfo?.rank && product.applicableAgreementInfo.rank > 1 && (
            <Alert variant="info" inline>
              Dette produktet er rangert som nummer {product.applicableAgreementInfo.rank} i delkontrakten. Ta en titt
              på høyere rangerte produkter for å se om det passer ditt behov.
            </Alert>
          )}

          {productsOnPosts.map((productsOnPost) => (
            <div key={productsOnPost.postTitle} className="agreement-details__products-on-post">
              <Heading level="4" size="small" spacing>
                {`Andre produkter delkontrakt ${productsOnPost.postTitle}`}
              </Heading>

              {productsOnPost.productsOnPost?.length ? (
                <div className="agreement-details__products-on-post-list">
                  {productsOnPost.productsOnPost?.map((product) => (
                    <ProductCard key={product.id} product={product} showRank={true} />
                  ))}
                </div>
              ) : (
                <BodyLong>Det finnes ingen andre produkter på samme delkontrakt</BodyLong>
              )}
            </div>
          ))}

          <div className="agreement-details__agreement-link spacing-top--small">
            <BodyLong>
              <NextLink href={`/rammeavtale/${product.applicableAgreementInfo?.id}`} className="link">
                Les mer om {product.applicableAgreementInfo?.title}
                <ChevronRightIcon aria-hidden fontSize={'1.5rem'} />
              </NextLink>
            </BodyLong>
          </div>
        </div>
      </section>
    </Bleed>
  )
}
