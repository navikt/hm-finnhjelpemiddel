'use client'

import NextLink from 'next/link'

import { Product } from '@/utils/product-util'

import ProductCard from '@/components/ProductCard'
import { Alert, BodyLong, ChevronRightIcon, Heading } from '@/components/aksel-client'
import { Bleed, VStack } from '@navikt/ds-react'
import { ProductsOnPost } from './page'

type AgreementInfoProps = {
  product: Product
  productsOnPosts: ProductsOnPost[]
}

export const AgreementInfo = ({ product, productsOnPosts }: AgreementInfoProps) => {
  const allAgreementsTheSame = productsOnPosts.every(
    (agreement) => agreement.agreementId === productsOnPosts[0].agreementId
  )

  const uniqueAgreements = product.agreements.filter(
    (agreement, index, self) => index === self.findIndex((a) => a.id === agreement.id)
  )

  if (!allAgreementsTheSame) {
    return (
      <Bleed marginInline="full" asChild reflectivePadding>
        <section className="agreement-details" aria-label="Informasjon om rammeavtalene produktet er på">
          <div className="agreement-details__content">
            <Heading level="3" size="large" id="agreement-info">
              Avtaler med Nav
            </Heading>

            {uniqueAgreements.map((agreement) => {
              return (
                <VStack gap="4" key={agreement.id} className="spacing-bottom--medium">
                  <Heading level="3" size="medium">
                    Avtale: {agreement.title}
                  </Heading>
                  {productsOnPosts.map((post) => {
                    if (post.agreementId === agreement.id) {
                      return (
                        <div key={post.postTitle} className="agreement-details__products-on-post">
                          <Heading level="4" size="small" spacing>
                            {`Andre produkter på delkontrakt ${post.postTitle}`}
                          </Heading>

                          {post.products?.length ? (
                            <div className="agreement-details__products-on-post-list">
                              {post.products?.map((product) => (
                                <ProductCard
                                  key={product.id}
                                  product={product}
                                  rank={product.agreements?.find((ag) => ag.postNr === post.postNr)?.rank}
                                  type="plain"
                                />
                              ))}
                            </div>
                          ) : (
                            <BodyLong>Det finnes ingen andre produkter på samme delkontrakt</BodyLong>
                          )}
                        </div>
                      )
                    }
                  })}
                  <div className="spacing-top--small spacing-bottom--small">
                    <NextLink href={`/rammeavtale/${agreement.id}`} className="agreement-details__agreement-link">
                      Les mer om {agreement.title}
                      <ChevronRightIcon aria-hidden fontSize={'1.5rem'} />
                    </NextLink>
                  </div>
                </VStack>
              )
            })}
          </div>
        </section>
      </Bleed>
    )
  }

  return (
    <Bleed marginInline="full" asChild reflectivePadding>
      <section className="agreement-details" aria-label="Informasjon om rammeavtalen produktet er på">
        <div className="agreement-details__content">
          <Heading level="3" size="large" id="agreement-info">
            Avtale med NAV
          </Heading>

          {product.agreements?.length === 1 && product.agreements[0]?.rank > 1 && product.agreements[0]?.rank < 90 && (
            <Alert variant="info" inline>
              Dette produktet er rangert som nummer {product.agreements[0].rank} i delkontrakten. Ta en titt på høyere
              rangerte produkter for å se om det passer ditt behov.
            </Alert>
          )}

          {productsOnPosts.map((post) => (
            <div key={post.postTitle} className="agreement-details__products-on-post">
              <Heading level="4" size="small" spacing>
                {`Andre produkter på delkontrakt ${post.postTitle}`}
              </Heading>

              {post.products?.length ? (
                <div className="agreement-details__products-on-post-list">
                  {post.products?.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      rank={product.agreements?.find((ag) => ag.postNr === post.postNr)?.rank}
                      type="plain"
                    />
                  ))}
                </div>
              ) : (
                <BodyLong>Det finnes ingen andre produkter på samme delkontrakt</BodyLong>
              )}
            </div>
          ))}

          <div className="spacing-top--small">
            {product.agreements?.length && (
              <NextLink
                href={`/rammeavtale/${product.agreements[0]?.id}`}
                className="agreement-details__agreement-link"
              >
                Les mer om {product.agreements[0]?.title}
                <ChevronRightIcon aria-hidden fontSize={'1.5rem'} />
              </NextLink>
            )}
          </div>
        </div>
      </section>
    </Bleed>
  )
}
