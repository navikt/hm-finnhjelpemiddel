export type IsoVersion = 16 | 22

export const DEFAULT_ISO_VERSION: IsoVersion = 16
export const ISO_VERSION_PARAM = 'isoVersion'

export const parseIsoVersion = (value: string | string[] | undefined | null): IsoVersion | undefined => {
  const raw = Array.isArray(value) ? value[0] : value
  return raw === '16' ? 16 : raw === '22' ? 22 : undefined
}

export const resolveIsoVersion = (queryValue: string | string[] | undefined | null, cookieValue?: string): IsoVersion =>
  parseIsoVersion(queryValue) ?? parseIsoVersion(cookieValue) ?? DEFAULT_ISO_VERSION

// Lenker arver versjonen fra URL-en, ikke fra cookien, slik at en eksplisitt ?isoVersion vinner på neste side
export const categoryHref = (href: string, isoVersion?: IsoVersion): string =>
  isoVersion ? `${href}${href.includes('?') ? '&' : '?'}${ISO_VERSION_PARAM}=${isoVersion}` : href
