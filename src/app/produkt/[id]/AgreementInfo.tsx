'use client'

import NextLink from 'next/link'

import { Product } from '@/utils/product-util'

import ProductCardCompare from '@/components/ProductCardCompare'
import { Alert, BodyLong, ChevronRightIcon, Heading } from '@/components/aksel-client'
import { Bleed } from '@navikt/ds-react'
import { ProductsOnPost } from './page'

type AgreementInfoProps = {
  product: Product
  productsOnPosts: ProductsOnPost[]
}

export const AgreementInfo = ({ product, productsOnPosts }: AgreementInfoProps) => {
  return (
    <Bleed marginInline="full" asChild reflectivePadding>
      <section
        className="agreement-details spacing-top--large"
        aria-label="Informasjon om rammeavtalen produktet er på"
      >
        <div className="agreement-details__content">
          <Heading level="3" size="large" id="agreement-info">
            Avtale med Nav
          </Heading>

          {product.agreements?.length === 1 && product.agreements[0]?.rank > 1 && (
            <Alert variant="info" inline>
              Dette produktet er rangert som nummer {product.agreements[0].rank} i delkontrakten. Ta en titt på høyere
              rangerte produkter for å se om det passer ditt behov.
            </Alert>
          )}

          {productsOnPosts.map((post) => (
            <div key={post.postTitle} className="agreement-details__products-on-post">
              <Heading level="4" size="small" spacing>
                {`Andre produkter på delkontrakt nr. ${post.postNr}: ${post.postTitle}`}
              </Heading>

              {post.products?.length ? (
                <div className="agreement-details__products-on-post-list">
                  {post.products?.map((product) => (
                    <ProductCardCompare
                      key={product.id}
                      product={product}
                      rank={product.agreements?.find((ag) => ag.postTitle === post.postTitle)?.rank}
                      showRank={true}
                    />
                  ))}
                </div>
              ) : (
                <BodyLong>Det finnes ingen andre produkter på samme delkontrakt</BodyLong>
              )}
            </div>
          ))}

          <div className="agreement-details__agreement-link spacing-top--small">
            <BodyLong>
              {product.agreements?.length && (
                <NextLink href={`/rammeavtale/${product.agreements[0]?.id}`} className="link">
                  Les mer om {product.agreements[0]?.title}
                  <ChevronRightIcon aria-hidden fontSize={'1.5rem'} />
                </NextLink>
              )}
            </BodyLong>
          </div>
        </div>
      </section>
    </Bleed>
  )
}
