export interface Supplier {
  id: number
  name: string
  address?: string
  email?: string
  phone?: string
  homepageUrl?: string
}

export const mapSupplier = (_source?: any): Supplier => {
  return {
    id: _source.id,
    name: _source.name,
    address: _source.address,
    email: _source.email,
    phone: _source.phone,
    homepageUrl: _source.homepage,
  }
}
