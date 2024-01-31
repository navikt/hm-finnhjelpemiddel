import { Document, mapDocuments } from './product-util'
import {
  AgreementLabelResponse,
  AgreementsSourceResponse,
  AttachmentsResponse,
  Hit,
  PostResponse,
  SearchResponse,
} from './response-types'
import { sortAlphabetically } from './sort-util'

export function getPostTitle(postTitle: string): string {
  const regex = /^(post\s\d{1,2}:\s|\d{1,2}:\s|\d{1,2}\.\s)/i
  return postTitle.replace(regex, '')
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
  attachments: Attachment[]
}

export interface AgreementLabel {
  id: string
  label: string
  identifier: string
  title: string
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

//TODO: Når vi skrur av hjelpemiddelbasen kan disse slettes fra database og vi trenger ikke lenger å filterre de ut her.
//TODO: Enn så lenge må vi gjøre det fordi de vil synkes fra hjelpemiddeldatabasen daglig

const excludedAgreementsDev: Record<string, string> = {
  Bilombygg: '123ea1cc-f366-4e08-a40c-8f50eafcdc78',
  Biler: '970d867a-d095-42a8-9f0a-495e42f301cb',
  Servicehunder: '744ca191-ed99-4a09-90f0-29f3733885f5',
  Høreapparater: '67196a0e-d1db-4c74-87ce-9d84da279c0a',
}

const excludedAgreementsProd: Record<string, string> = {
  Bilombygg: 'c7a188d1-c54c-41de-9869-f40021738d37',
  Biler: 'f082242e-e3c1-4f73-bbf6-9e06f3be9721',
  Servicehunder: '8d55f208-9a78-4952-a4d1-cbb706bd7d9c',
  Høreapparater: 'd73b510b-0043-4c9e-92ac-25b4ace236c9',
}

export const mapAgreementLabels = (data: SearchResponse): AgreementLabel[] => {
  const excludedValues = Object.values(
    process.env.RUNTIME_ENVIRONMENT === 'production' ? excludedAgreementsProd : excludedAgreementsDev
  )

  return data.hits.hits
    .filter((hit) => !excludedValues.includes(hit._source.id))
    .map((hit: Hit) => mapAgreementLabel(hit._source as AgreementLabelResponse))
}

export const mapAgreementLabel = (source: AgreementLabelResponse): AgreementLabel => {
  return {
    id: source.id,
    label: source.label,
    identifier: source.identifier,
    title: source.title,
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

export const agreementHasNoProducts = (identifier: string): boolean => {
  return agreementWithNoProducts.includes(identifier)
}

export const agreementWithNoProducts = ['HMDB-8582', 'HMDB-8682', 'HMDB-8673', 'HMDB-8685', 'HMDB-8734', 'HMDB-8669']
