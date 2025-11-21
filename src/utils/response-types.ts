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
  key: number
  doc_count: number
  products: Hit[]
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
  _source: ProductSourceResponse | AgreementsSourceResponse | AgreementLabelResponse | SupplierInfoResponse
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
  isoCategoryTitleInternational: string
  isoCategoryText: string
  accessory: boolean
  sparePart: boolean
  seriesId: string
  data: Array<TechDataResponse>
  main: boolean
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
  compatibleWith?: CompatibleWithResponse
  worksWith?: WorksWithResponse
  series?: string
  keywords?: string[]
  shortdescription?: string
  text?: string
  url?: string
  tags?: string[]
  bestillingsordning?: boolean
  digitalSoknad?: boolean
}

export interface CompatibleWithResponse {
  seriesIds: string[]
  productIds: string[]
}

export interface WorksWithResponse {
  seriesIds: string[]
  productIds: string[]
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
  postIdentifier: string
  refNr: string | null
  postTitle: string
  reference: string | null
  expired: string
}

export interface SupplierInfoResponse {
  id: string
  identifier: string
  status: 'INACTIVE' | 'ACTIVE'
  name: string
  address?: string | null
  postNr?: string | null
  postLocation?: string | null
  email?: string | null
  phone?: string | null
  homepage?: string | null
}

export type MediaSourceType = 'HMDB' | 'REGISTER' | 'EXTERNALURL' | 'IMPORT' | 'UNKNOWN'

export type MediaType = 'PDF' | 'IMAGE' | 'VIDEO' | 'OTHER'

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
  published: string
  expired: string
}

export interface PostResponse {
  identifier: string
  nr: number
  refNr: string
  title: string
  description: string
  created: string
}

export interface AttachmentsResponse {
  title: string
  media: MediaResponse[]
  description: string
}

export interface NewsResponse {
  id: string
  identifier: string
  title: string
  text: string
  status: 'INACTIVE' | 'ACTIVE'
  published: Date //date
  expired: Date //date
  created: Date //date
  updated: Date //date
  createdBy: string
  updatedBy: string
  author: string
}

export interface IsoResponse {
  isoCode: string
  isoTitle: string
  isoText: string
  isoTextShort: string
  isoTranslations: {
    titleEn: string
    textEn: string
  }
  isoLevel: number
  isActive: boolean
  showTech: boolean
  allowMulti: boolean
  created: Date
  updated: Date
  searchWords: string[]
}
