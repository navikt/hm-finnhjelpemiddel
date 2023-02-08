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
  hmsartNr?: string | null
  identifier: string
  supplierRef: string
  isoCategory: string
  accessory: boolean
  sparepart: boolean
  seriesId?: string | null
  data: Array<{ key: string; value: string; unit: string }>
  media: Media[]
  created: string
  updated: string
  expired: string
  createdBy: string
  updatedBy: string
  filters: object
  agreementInfo?: AgreementInfo | null
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

interface AgreementInfo {
  id: string
  identifier?: string | null
  rank: number
  postNr: number
  postIdentifier?: string | null
  reference?: string | null
  expired: string
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

enum MediaType {
  PDF,
  IMAGE,
  VIDEO,
  OTHER,
}

interface Media {
  id: string
  order: number
  type: MediaType
  uri: string
  text?: string | null
  source?: MediaSourceType
}
