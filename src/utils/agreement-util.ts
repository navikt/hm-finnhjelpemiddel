import { Document, Product, mapDocuments, mapProductWithVariants } from './product-util'
import {
  AgreementDocResponse,
  AgreementLabelResponse,
  AgreementsSourceResponse,
  AttachmentsResponse,
  Hit,
  PostBucketResponse,
  PostResponse,
  ProductSourceResponse,
  SearchResponse,
} from './response-types'
import { sortAlphabetically } from './sort-util'

export interface Agreement {
  id: string
  identifier: string
  title: string
  label: string
  descriptionHtml: string //html
  published: Date //date
  expired: Date //date
  posts: Post[]
  attachments: Attachment[]
  reference: string
}

export interface AgreementLabel {
  id: string
  label: string
  identifier: string
  title: string
  published: Date
  expires: Date
}

export interface Attachment {
  title: string
  description: string
  documents: Document[]
}

export interface Post {
  identifier: string
  nr: number
  title: string
  description: string
}

export interface PostWithProducts {
  nr: number
  title: string
  products: {
    rank: number
    hmsNumbers?: string[]
    variantCount?: number
    product: Product
  }[]
}

/**
 * Maps top result from opensearch into agreement info
 */
export const mapAgreementFromSearch = (data: SearchResponse): Agreement => {
  return data.hits.hits.map((hit: Hit) => mapAgreement(hit._source as AgreementsSourceResponse))[0]
}

/**
 * Maps from opensearch document endpoint
 */
export const mapAgreementFromDoc = (data: AgreementDocResponse): Agreement => {
  return mapAgreement(data._source as AgreementsSourceResponse)
}

export const mapAgreement = (source: AgreementsSourceResponse): Agreement => {
  return {
    id: source.id,
    identifier: source.identifier,
    title: source.title,
    label: source.label,
    descriptionHtml: source.text,
    published: new Date(source.published) ?? '',
    expired: new Date(source.expired) ?? '',
    posts: mapPosts(source.posts),
    attachments: mapAttachments(source.attachments),
    reference: source.reference,
  }
}

//TODO: Når vi skrur av hjelpemiddelbasen kan disse slettes fra database og vi trenger ikke lenger å filterre de ut her.
//TODO: Enn så lenge må vi gjøre det fordi de vil synkes fra hjelpemiddeldatabasen daglig

const excludedAgreementsDev: Record<string, string> = {
  Bilombygg: '123ea1cc-f366-4e08-a40c-8f50eafcdc78',
  Biler: '970d867a-d095-42a8-9f0a-495e42f301cb',
  Servicehunder: '744ca191-ed99-4a09-90f0-29f3733885f5',
  Høreapparater: '67196a0e-d1db-4c74-87ce-9d84da279c0a',
  Seksuallivet: '3c4ee9ba-a348-4fee-ab92-a67990e95316',
}

const excludedAgreementsProd: Record<string, string> = {
  Bilombygg: 'c7a188d1-c54c-41de-9869-f40021738d37',
  Biler: 'f082242e-e3c1-4f73-bbf6-9e06f3be9721',
  Servicehunder: '8d55f208-9a78-4952-a4d1-cbb706bd7d9c',
  Høreapparater: 'd73b510b-0043-4c9e-92ac-25b4ace236c9',
  Seksuallivet: '768b68d7-9e3a-4865-983e-09b47ecc6a2c',
}

export const mapAgreementLabels = (data: SearchResponse): AgreementLabel[] => {
  const excludedAgreements = Object.values(
    process.env.BUILD_ENV === 'prod' ? excludedAgreementsProd : excludedAgreementsDev
  )

  return data.hits.hits
    .filter((hit) => !excludedAgreements.includes(hit._source.id))
    .map((hit: Hit) => mapAgreementLabel(hit._source as AgreementLabelResponse))
}

export const mapAgreementLabel = (source: AgreementLabelResponse): AgreementLabel => {
  return {
    id: source.id,
    label: source.label,
    identifier: source.identifier,
    title: source.title,
    published: new Date(source.published) ?? '',
    expires: new Date(source.expired) ?? '',
  }
}

const mapAttachments = (attachments: AttachmentsResponse[]): Attachment[] => {
  return attachments
    .map((attachments: AttachmentsResponse) => ({
      title: attachments.title,
      description: attachments.description,
      documents: mapDocuments(attachments.media),
    }))
    .filter((attachments) => {
      return (
        attachments.title !== '' && attachments.title !== 'Hurtigoversikt ' && attachments.title !== 'Hurtigoversikt'
      )
    })
    .sort((a, b) => sortAlphabetically(a.title, b.title))
}

const mapPosts = (posts: PostResponse[]): Post[] => {
  return posts.map((post: PostResponse) => ({
    identifier: post.identifier,
    nr: post.nr,
    title: post.title,
    description: post.description,
  }))
}

export const mapAgreementProducts = (postBuckets: PostBucketResponse[], agreement: Agreement): PostWithProducts[] => {
  const getPostTitle = (postNr: number) => agreement.posts.find((post) => post.nr === postNr)?.title
  const getRank = (product: Product, postNr: number) =>
    product.agreements.find(
      (agreementOnProduct) => agreementOnProduct.id === agreement.id && agreementOnProduct.postNr === postNr
    )?.rank
  const posts = postBuckets.map((post) => {
    let seen: string[] = []
    const postTitle = getPostTitle(post.key)
    return {
      nr: post.key,
      title: postTitle ?? '',
      products: post.topHitData.hits.hits
        .map((hit) => {
          const product = mapProductWithVariants(Array(hit._source as ProductSourceResponse))

          return {
            rank: getRank(product, post.key) || 99,
            product: product,
          }
        })
        .filter((prod) => {
          if (
            seen.includes(prod.product.id) ||
            !prod.product.agreements.some(
              (prodAgreement) => prodAgreement.id === agreement.id && prodAgreement.postNr === post.key
            )
          ) {
            return false
          } else {
            seen.push(prod.product.id)
            return true
          }
        })
        .sort((a, b) => a.rank - b.rank),
    }
  })

  return posts
}

export const agreementHasNoProducts = (identifier: string): boolean => {
  return agreementWithNoProducts.includes(identifier)
}

export const agreementWithNoProducts = [
  'HMDB-8582',
  'HMDB-8682',
  'HMDB-8673',
  'HMDB-8685',
  'HMDB-8734',
  'HMDB-8669',
  //Omgivelseskontroll
  'HMDB-8736',
]
