'use client'

import NextLink from 'next/link'

import { Product } from '@/utils/product-util'

import ProductCard from '@/components/ProductCard'
import { Alert, BodyLong, ChevronRightIcon, Heading } from '@/components/aksel-client'
import { HStack, VStack } from '@navikt/ds-react'
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
      <VStack gap="4">
        {uniqueAgreements.map((agreement) => {
          return (
            <VStack gap="4" key={agreement.id} className="spacing-bottom--medium">
              <Heading level="3" size="medium">
                Avtale: {agreement.title}
              </Heading>
              {productsOnPosts.map((post) => {
                if (post.agreementId === agreement.id) {
                  return (
                    <VStack gap="4" key={post.postTitle} className="spacing-top--small">
                      <Heading level="4" size="small" spacing>
                        {`Andre produkter på delkontrakt ${post.postTitle}`}
                      </Heading>

                      {post.products?.length ? (
                        <HStack wrap gap="4">
                          {post.products?.map((product) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                              rank={product.agreements?.find((ag) => ag.postNr === post.postNr)?.rank}
                              type="plain"
                            />
                          ))}
                        </HStack>
                      ) : (
                        <BodyLong>Det finnes ingen andre produkter på samme delkontrakt</BodyLong>
                      )}
                    </VStack>
                  )
                }
              })}
              <div className="spacing-top--small spacing-bottom--small">
                <NextLink
                  href={`/rammeavtale/hjelpemidler/${agreement.id}`}
                  className="agreement-details__agreement-link"
                >
                  {`Se andre produkter på "${agreement.title}" avtalen`}
                  <ChevronRightIcon aria-hidden fontSize={'1.5rem'} />
                </NextLink>
              </div>
            </VStack>
          )
        })}
      </VStack>
    )
  }

  return (
    <VStack gap="4">
      {product.agreements?.length === 1 && product.agreements[0]?.rank > 1 && product.agreements[0]?.rank < 90 && (
        <Alert variant="info" inline>
          Dette produktet er rangert som nummer {product.agreements[0].rank} i delkontrakten. Ta en titt på høyere
          rangerte produkter for å se om det passer ditt behov.
        </Alert>
      )}

      {productsOnPosts.map((post) => (
        <VStack gap="4" key={post.postTitle} className="spacing-top--small">
          <Heading level="4" size="small" spacing>
            {`Andre produkter på delkontrakt ${post.postTitle}`}
          </Heading>

          {post.products?.length ? (
            <HStack wrap gap="4">
              {post.products?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  rank={product.agreements?.find((ag) => ag.postNr === post.postNr)?.rank}
                  type="plain"
                />
              ))}
            </HStack>
          ) : (
            <BodyLong>Det finnes ingen andre produkter på samme delkontrakt</BodyLong>
          )}
        </VStack>
      ))}

      <div className="spacing-top--small">
        {product.agreements?.length && (
          <NextLink
            href={`/rammeavtale/hjelpemidler/${product.agreements[0]?.id}`}
            className="agreement-details__agreement-link"
          >
            {`Se andre produkter på "${product.agreements[0]?.title}" avtalen`}
            <ChevronRightIcon aria-hidden fontSize={'1.5rem'} />
          </NextLink>
        )}
      </div>
    </VStack>
  )
}
