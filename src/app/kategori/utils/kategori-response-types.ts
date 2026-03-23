import { Hit } from '@/utils/response-types'

type IsoBucket = {
  key: string[]
  doc_count: number
}

type IsoAggregation = {
  doc_count: number
  values: {
    buckets: IsoBucket[]
  }
}

type SupplierBucket = {
  key: string
  doc_count: number
}

type SupplierAggregation = {
  doc_count: number
  values: {
    buckets: SupplierBucket[]
  }
}

type TechDataAggregation = {
  doc_count: number
  values: {
    buckets: { key: string; doc_count: number }[]
  }
}

export type ProductIsoAggregationResponse = {
  hits: {
    total: object
    hits: Hit[]
  }
  aggregations: {
    iso: IsoAggregation
    suppliers: SupplierAggregation
  } & {
    [key: string]: TechDataAggregation
  }
}
