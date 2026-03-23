import { Product } from '@/utils/product-util'

export type IsoInfo = {
  code: string
  name: string
}

export type SupplierInfo = {
  name: string
}

export type TechDataFilterAgg = { filter: CategoryFilter; values: string[] }
export type TechDataFilterAggs = Map<string, TechDataFilterAgg>

export type ProductsWithIsoAggs = {
  products: Product[]
  iso: IsoInfo[]
  suppliers: SupplierInfo[]
  techDataFilterAggs: TechDataFilterAggs
}

export type CategoryFilter = {
  identifier: string //identifier
  fieldLabel: string
  searchParamName: string
  filterFunctionType: FilterFunctionType
  openSearchFieldGroups: (string | MinMaxFields)[]
  unit?: string
}

export interface MinMaxFields {
  fromField: string
  toField: string
}

export enum FilterTechDataType {
  singleField,
  minMax,
}

export enum FilterFunctionType {
  singleField,
  range,
}
