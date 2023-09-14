import { Document, mapDocuments } from './product-util'
import {
  AgreementLabelResponse,
  AgreementsSourceResponse,
  AttachmentsResponse,
  Hit,
  PostResponse,
  SearchResponse,
} from './response-types'

export function getPostTitle(post: string, postNr: number): string
export function getPostTitle(posts: Post[], postNr: number): string | undefined
export function getPostTitle(post: unknown, postNr: number): string | undefined {
  const prefix = `Post ${postNr}: `
  if (typeof post === 'string') {
    return post.substring(prefix.length)
  } else if (Array.isArray(post)) {
    return post.find((post) => post.nr === postNr)?.title.substring(prefix.length)
  }
  throw new Error('Could not get postTitle')
}

export interface Agreement {
  id: string
  identifier: string
  title: string
  label: string
  descriptionHtml: string //html
  published: Date //date
  expired: Date //date
  posts: Post[]
  attachments: Attachments[]
}

export interface AgreementLabel {
  id: string
  label: string
}

export interface Attachments {
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

/**
 * Maps top result from opensearch into agreement info
 */
export const mapAgreementFromSearch = (data: SearchResponse): Agreement => {
  return data.hits.hits.map((hit: Hit) => mapAgreement(hit._source as AgreementsSourceResponse))[0]
}

export const mapAgreement = (source: AgreementsSourceResponse): Agreement => {
  return {
    id: source.id,
    identifier: source.identifier,
    title: source.title,
    label: source.label,
    descriptionHtml: source.text,
    published: new Date(Date.parse(source.published)) ?? '',
    expired: new Date(Date.parse(source.expired)) ?? '',
    posts: mapPosts(source.posts),
    attachments: mapAttachments(source.attachments),
  }
}

export const mapAgreementLabels = (data: SearchResponse): AgreementLabel[] => {
  return data.hits.hits.map((hit: Hit) => mapAgreementLabel(hit._source as AgreementLabelResponse))
}

export const mapAgreementLabel = (source: AgreementLabelResponse): AgreementLabel => {
  return {
    id: source.id,
    label: source.label,
  }
}

const mapAttachments = (attachments: AttachmentsResponse[]): Attachments[] => {
  return attachments
    .map((attachments: AttachmentsResponse) => ({
      title: attachments.title,
      description: attachments.description,
      documents: mapDocuments(attachments.media),
    }))
    .filter((attachments) => {
      return attachments.title !== 'Hurtigoversikt ' && attachments.title !== 'Hurtigoversikt'
    })
}

const mapPosts = (posts: PostResponse[]): Post[] => {
  return posts.map((post: PostResponse) => ({
    identifier: post.identifier,
    nr: post.nr,
    title: post.title,
    description: post.description,
  }))
}

export const agreementHasNoProducts = (identifier: string) => {
  return agreementWithNoProducts.includes(identifier)
}

export const agreementWithNoProducts = ['HMDB-8582', 'HMDB-8682', 'HMDB-8673', 'HMDB-8685']

export const agreementAttachmentLabels: Record<string, string> = {
  Tilbehør: 'Tilbehør for hver leverandør',
  Tjenester: 'Tjenester for hver leverandør',
  Reservedeler: 'Reservedeler for hver leverandør',
  Endringskatalog: 'Endringskataloger for hver leverandør',
}

export function getAttachmentLabel(key: string): string | undefined {
  const matchingKey = Object.keys(agreementAttachmentLabels).find((labelKey) => key.startsWith(labelKey))

  if (matchingKey) {
    return agreementAttachmentLabels[matchingKey]
  }

  return undefined
}
