'use client'

import NextLink from 'next/link'

import useSWRImmutable from 'swr/immutable'

import { BodyLong, BodyShort, Link, Loader, LocalAlert, VStack } from '@navikt/ds-react'

import { Agreement } from '@/utils/agreement-util'
import { fetchAgreementsByIds } from '@/utils/api-util'
import { sanitize } from '@/utils/news-html-util'
import { AgreementInfo, containsHTML, validateHTML } from '@/utils/product-util'

import styles from './ProductInfo.module.scss'

interface AgreementInformationData {
  id: string
  title: string
  posts: {
    nr: number
    refNr: string | null
    title: string
    description: string | null
    postExists: boolean
  }[]
}

// Samme avtale og delkontrakt kan forekomme flere ganger med ulik rangering eller fra flere varianter.
const groupPostsByAgreementId = (productAgreements: AgreementInfo[]) => {
  const postsByAgreementId = new Map<string, AgreementInfo[]>()

  productAgreements.forEach((productAgreement) => {
    const agreementPosts = postsByAgreementId.get(productAgreement.id) ?? []
    if (!agreementPosts.some((post) => post.postNr === productAgreement.postNr)) {
      agreementPosts.push(productAgreement)
    }
    postsByAgreementId.set(productAgreement.id, agreementPosts)
  })

  return postsByAgreementId
}

const mapAgreementInformation = (
  postsByAgreementId: Map<string, AgreementInfo[]>,
  agreements: Agreement[],
  now: Date
): AgreementInformationData[] =>
  Array.from(postsByAgreementId.entries()).flatMap(([agreementId, productPosts]) => {
    const agreement = agreements.find((agreement) => agreement.id === agreementId)
    if (!agreement || !(agreement.published <= now && agreement.expired >= now)) {
      return []
    }

    return [
      {
        id: agreement.id,
        title: agreement.title,
        posts: productPosts.map((productPost) => {
          const post = agreement.posts.find((agreementPost) => agreementPost.nr === productPost.postNr)

          return {
            nr: productPost.postNr,
            refNr: post?.refNr ?? null,
            title: productPost.postTitle?.trim() || post?.title.trim() || '',
            description: post?.description.trim() ? post.description : null,
            postExists: Boolean(post),
          }
        }),
      },
    ]
  })

// validateHTML sjekker bare tagnavn. sanitize fjerner i tillegg hendelsesattributter og javascript:-lenker.
const PostDescription = ({ description }: { description: string }) =>
  containsHTML(description) && validateHTML(description) ? (
    <div className={styles.agreementDescription} dangerouslySetInnerHTML={{ __html: sanitize(description) }} />
  ) : (
    <BodyLong>{description}</BodyLong>
  )

const formatListLetter = (index: number): string => {
  const letter = String.fromCharCode(97 + (index % 26))
  return index < 26 ? letter : `${formatListLetter(Math.floor(index / 26) - 1)}${letter}`
}

export const AgreementInformation = ({
  productAgreements,
  scope = 'product',
}: {
  productAgreements: AgreementInfo[]
  scope?: 'product' | 'variant' | 'variants'
}) => {
  const postsByAgreementId = groupPostsByAgreementId(productAgreements)
  const agreementIds = Array.from(postsByAgreementId.keys()).sort()

  const { data, error, isLoading } = useSWRImmutable(
    agreementIds.length > 0 ? { key: 'product-agreement-information', agreementIds } : null,
    ({ agreementIds }) => fetchAgreementsByIds(agreementIds)
  )

  if (isLoading) {
    return <Loader size={'large'} title={'Henter avtaleinformasjon'} />
  }

  if (error || !data) {
    return (
      <LocalAlert status={'error'}>
        <LocalAlert.Header>
          <LocalAlert.Title>Kunne ikke hente avtaleinformasjon</LocalAlert.Title>
        </LocalAlert.Header>
        <LocalAlert.Content>Prøv igjen senere.</LocalAlert.Content>
      </LocalAlert>
    )
  }

  const agreements = mapAgreementInformation(postsByAgreementId, data, new Date())

  if (agreements.length === 0) {
    return <BodyLong>Det finnes ingen gyldige avtaler for produktet.</BodyLong>
  }

  const formatPostNumber = (postNr: number) => new Intl.NumberFormat('nb-NO').format(postNr)
  const agreementCount = agreements.length
  const postCount = agreements.reduce((count, agreement) => count + agreement.posts.length, 0)
  const subject = scope === 'variant' ? 'Varianten' : scope === 'variants' ? 'De valgte variantene' : 'Produktet'

  return (
    <VStack gap={'space-32'}>
      {(agreementCount > 1 || postCount > 1) && (
        <BodyLong>
          {subject} er tilknyttet {agreementCount} {agreementCount === 1 ? 'avtale' : 'avtaler'} og {postCount}{' '}
          {postCount === 1 ? 'delkontrakt' : 'delkontrakter'}.
        </BodyLong>
      )}
      {agreements.map((agreement, agreementIndex) => (
        <VStack
          as="section"
          gap={'space-16'}
          key={agreement.id}
          aria-labelledby={`agreement-information-${agreement.id}`}
        >
          <VStack gap={'space-2'}>
            <BodyShort weight={'semibold'}>
              {agreementCount > 1 ? `${formatListLetter(agreementIndex)}. ` : ''}Avtalenavn
            </BodyShort>
            <Link as={NextLink} href={`/rammeavtale/${agreement.id}`} id={`agreement-information-${agreement.id}`}>
              {agreement.title}
            </Link>
          </VStack>
          <VStack gap={'space-24'}>
            {agreement.posts.map((post, postIndex) => {
              const postNumber = post.refNr?.trim() || formatPostNumber(post.nr)
              const postTitle = post.title || `Delkontrakt ${postNumber}`
              const postMarker =
                agreement.posts.length > 1
                  ? `${agreementCount > 1 ? formatListLetter(agreementIndex) : ''}${postIndex + 1}. `
                  : ''
              const postHref =
                post.postExists && post.refNr ? `/rammeavtale/hjelpemidler/${agreement.id}#${post.refNr}` : null

              return (
                <VStack gap={'space-16'} key={post.nr}>
                  <VStack gap={'space-2'}>
                    <BodyShort weight={'semibold'}>{postMarker}Delkontrakt</BodyShort>
                    {postHref ? (
                      <Link as={NextLink} href={postHref}>
                        {postTitle}
                      </Link>
                    ) : (
                      <BodyShort>{postTitle}</BodyShort>
                    )}
                  </VStack>
                  <VStack gap={'space-2'}>
                    <BodyShort weight={'semibold'}>Delkontraktbeskrivelse</BodyShort>
                    {post.description ? (
                      <PostDescription description={post.description} />
                    ) : (
                      <BodyShort>
                        {post.postExists
                          ? 'Beskrivelsen av delkontrakten er ikke tilgjengelig.'
                          : 'Delkontrakten finnes ikke i avtaledokumentet.'}
                      </BodyShort>
                    )}
                  </VStack>
                </VStack>
              )
            })}
          </VStack>
        </VStack>
      ))}
    </VStack>
  )
}
