export interface SearchResponse {
  took: number
  timed_out: boolean
  _shards: object
  hits: {
    total: object
    hits: Hit[]
  }
}

export interface SeriesAggregationResponse {
  took: number
  timed_out: boolean
  _shards: object
  hits: object
  aggregations: {
    series_buckets: SeriesBucketsResponse
  }
}

export interface AgreementSearchResponse {
  took: number
  timed_out: boolean
  _shards: object
  hits: object
  aggregations: {
    postNr: {
      buckets: PostBucketResponse[]
      doc_count_error_upper_bound: number
      sum_other_doc_count: number
    }
    leverandor: {
      values: {
        buckets: { key: string; doc_count: number }
      }
    }
  }
}

export interface PostBucketResponse {
  doc_count: number
  //key = postnr
  key: number
  seriesId: {
    buckets: SeriesTopHitBucket[]
    doc_count_error_upper_bound: number
    sum_other_doc_count: number
  }
}

interface SeriesTopHitBucket {
  doc_count: number
  //key = seriesId
  key: number
  topHitData: {
    hits: {
      total: object
      hits: Hit[]
    }
  }
}

interface SeriesBucketsResponse {
  after_key: {
    seriesId: string
  }
  buckets: SeriesBucketResponse[]
}

export interface SeriesBucketResponse {
  key: {
    seriesId: string
  }
  doc_count: number
  products: {
    hits: {
      total: object
      hits: Hit[]
    }
  }
}

export interface Hit {
  _index: string
  _type: string | null
  _id: string
  _score: string
  _source: ProductSourceResponse | AgreementsSourceResponse | AgreementLabelResponse
}

export interface ProductDocResponse {
  _index: string
  _id: string
  _found: boolean
  _source: ProductSourceResponse
}

export interface ProductSourceResponse {
  id: string
  articleName: string
  supplier: {
    id: string
    identifier: string
    name: string
  }
  title: string
  attributes: AttributeResponse
  status: 'INACTIVE' | 'ACTIVE'
  hmsArtNr: string | null
  identifier: string
  supplierRef: string
  isoCategory: string
  isoCategoryTitle: string
  isoCategoryText: string
  accessory: boolean
  sparepart: boolean
  seriesId: string
  data: Array<TechDataResponse>
  media: MediaResponse[]
  created: string
  updated: string
  expired: string
  createdBy: string
  updatedBy: string
  filters: { [key: string]: string }
  agreements: AgreementInfoResponse[]
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
  updated: string
}

export interface AgreementInfoResponse {
  id: string
  identifier: string
  title: string
  rank: number
  postNr: number
  postTitle: string
  reference: string | null
  expired: string
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
  ACTIVE,
  INACTIVE,
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
  label: string
  resume: string
  text: string
  reference: string
  published: string
  expired: string
  attachments: AttachmentsResponse[]
  posts: PostResponse[]
  createdBy: string
  updatedBy: string
  created: string
  updated: string
}

export interface AgreementDocResponse {
  _index: string
  _id: string
  _found: boolean
  _source: AgreementsSourceResponse
}

export interface AgreementLabelResponse {
  id: string
  label: string
  identifier: string
  title: string
}

export interface PostResponse {
  identifier: string
  nr: number
  title: string
  description: string
  created: string
}

export interface AttachmentsResponse {
  title: string
  media: MediaResponse[]
  description: string
}

export interface News {
  id: string
  identifier: string
  title: string
  text: string
  status: Status
  published: Date //date
  expired: Date //date
}

export interface NewsResponse {
  id: string
  identifier: string
  title: string
  text: string
  status: Status
  published: string
  expired: string
  created: string
  updated: string
  createdBy: string
  updatedBy: string
  author: string
}
