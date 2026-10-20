export type IsoVersion = 16 | 22

export const DEFAULT_ISO_VERSION: IsoVersion = 16
export const ISO_VERSION_COOKIE = 'isoVersion'

const parseIsoVersion = (value: string | string[] | undefined | null): IsoVersion | undefined => {
  const raw = Array.isArray(value) ? value[0] : value
  return raw === '16' ? 16 : raw === '22' ? 22 : undefined
}

export const resolveIsoVersion = (
  searchParams: { [key: string]: string[] | string | undefined },
  cookieValue?: string
): IsoVersion => parseIsoVersion(searchParams.isoVersion) ?? parseIsoVersion(cookieValue) ?? DEFAULT_ISO_VERSION

export const categoryHref = (href: string, isoVersion?: IsoVersion): string =>
  isoVersion === 22 ? `${href}${href.includes('?') ? '&' : '?'}isoVersion=22` : href
