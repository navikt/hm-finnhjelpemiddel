import { Hit, SearchResponse, SupplierInfoResponse } from './response-types'

export const alphabet = [...Array(26).keys()]
  .map((n) => String.fromCharCode(65 + n))
  .concat([String.fromCharCode(198), 'Ø', String.fromCharCode(197)])

export interface Supplier {
  id: string
  identifier: string
  name: string
  address?: string | null
  email?: string | null
  phone?: string | null
  homepageUrl?: string | null
}

export const mapSuppliers = (data: SearchResponse): Supplier[] => {
  return data.hits.hits
    .map((hit: Hit) => mapSupplier(hit._source as SupplierInfoResponse))
    .filter((supplier: Supplier) => !supplier.name.includes('(opphørt)'))
}

export const mapSupplier = (_source: SupplierInfoResponse): Supplier => {
  return {
    id: _source.id,
    identifier: _source.identifier,
    name: _source.name,
    address: _source.address,
    email: _source.email,
    phone: _source.phone,
    homepageUrl: _source.homepage,
  }
}
