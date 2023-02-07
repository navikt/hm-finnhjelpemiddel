import { SupplierInfoResponse } from './response-types'

export interface Supplier {
  id: string
  identifier: string
  name: string
  address?: string | null
  email?: string | null
  phone?: string | null
  homepageUrl?: string | null
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
