import { IsoResponse } from '@/utils/response-types'

// client stuff???
const HM_GRUNNDATA_DB = process.env.HM_GRUNNDATA_DB || ''

export const fetchIsoTree = async (): Promise<IsoTree> => {
  return await fetch(`${HM_GRUNNDATA_DB}/api/v1/isocategories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
  })
    .then((res) => res.json())
    .then((data) => {
      return mapIso(data)
    })
}

const mapIso = (data: IsoResponse[]): IsoTree =>
  Object.assign(
    {},
    ...data.map((iso) => ({
      [iso.isoCode]: {
        isoCode: iso.isoCode,
        isoTitle: iso.isoTitle,
        isoText: iso.isoText,
        isoTextShort: iso.isoTextShort,
        isoLevel: iso.isoLevel,
      },
    }))
  )

export type IsoTree = {
  [isoCode: string]: Iso
}

export type Iso = {
  isoCode: string
  isoTitle: string
  isoText: string
  isoTextShort: string
  isoLevel: number
}
