export interface SearchResponse {
  took: number
  timed_out: boolean
  _shards: object
  hits: {
    total: object
    hits: Hit[]
  }
}

export interface Hit {
  _index: string
  _type: string
  _id: string
  _score: string
  _source: ProductSourceResponse
}

export interface ProductSourceResponse {
  id: string
  supplier: {
    id: string
    identifier: string
    name: string
  }
  title: string
  attributes: AttributeResponse
  status: Status
  hmsArtNr: string | null
  identifier: string
  supplierRef: string
  isoCategory: string
  isoCategoryTitle: string
  isoCategoryText: string
  accessory: boolean
  sparepart: boolean
  seriesId: string | null
  data: Array<TechDataResponse>
  media: MediaResponse[]
  created: string
  updated: string
  expired: string
  createdBy: string
  updatedBy: string
  filters: object
  agreementInfo: AgreementInfoResponse | null
  hasAgreement: boolean
}

interface AttributeResponse {
  manufacturer?: string
  articlename?: string
  compatible?: string[]
  series?: string
  keywords?: string[]
  shortdescription?: string
  text?: string
  url?: string
  tags?: string[]
  bestillingsordning?: boolean
}

export interface TechDataResponse {
  key: string
  value: string
  unit: string
}

export interface MediaResponse {
  id: string
  priority: number
  type: MediaType
  uri: string
  text?: string | null
  source?: MediaSourceType
}

interface AgreementInfoResponse {
  id: string
  identifier: string | null
  rank: number
  postNr: number
  postIdentifier: string | null
  reference: string | null
}

export interface SupplierInfoResponse {
  id: string
  identifier: string
  status: Status
  name: string
  address?: string | null
  email?: string | null
  phone?: string | null
  homepage?: string | null
}

enum Status {
  Active,
  Inactive,
}

enum MediaSourceType {
  HMDB,
  GCP,
  EXTERNALURL,
}

export enum MediaType {
  PDF = 'PDF',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  OTHER = 'OTHER',
}

export interface AgreementsSourceResponse {
  id: string
  identifier: string
  title: string
  resume: string
  text: string
  reference: string
  published: string
  expired: string
  attachments: []
  posts: PostResponse[]
  createdBy: string
  updatedBy: string
  created: string
  updated: string
}

export interface PostResponse {
  identifier: string
  nr: number
  title: string
  description: string
  created: string
}
