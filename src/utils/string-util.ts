import { AgreementInfo } from './product-util'

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

// Rules from Språkrådet: https://www.sprakradet.no/sprakhjelp/Skriveregler/Mellomrom/
export const toValueAndUnit = (value: string, unit: string) => {
  if (unit === '"' || unit === "'" || unit === '°') {
    return value + unit
  }

  return `${value} ${unit}`
}

export const tryParseNumber = (value: string) => {
  try {
    return Number(value)
  } catch {}
  return NaN
}

export function findUniqueStringValues(arr: string[]): string {
  const uniqueValuesSet: Set<string> = new Set(arr)
  const uniqueValuesArray: string[] = Array.from(uniqueValuesSet)

  if (uniqueValuesArray.length === 1) {
    return uniqueValuesArray[0]
  } else {
    return uniqueValuesArray.join(', ')
  }
}

export const dateToString = (date: Date): string => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  const dayWithZero = day < 10 ? `0${day}` : day
  const monthWithZero = month < 10 ? `0${month}` : month

  return `${dayWithZero}.${monthWithZero}.${year}`
}

export const titleCapitalized = (title: string) => {
  if (title.length === 0) {
    return title
  }
  if (title.length === 1) {
    return title.charAt(0).toUpperCase()
  }
  return title.charAt(0).toUpperCase() + title.slice(1)
}

export const formatAgreementRanks = (agreements: AgreementInfo[]): string => {
  const ranks = new Set(agreements.map((agr) => agr.rank))

  if (agreements.length === 0) return '-'
  if (ranks.size === 1 && ranks.has(99)) return 'Urangert'

  return agreements
    .map((ag) => ag.rank)
    .filter((rank) => rank !== 99)
    .sort()
    .join(', ')
}

export const formatAgreementPosts = (agreements: AgreementInfo[]): string => {
  return agreements
    .map((ag) => ag.refNr)
    .sort()
    .join(', ')
}

export const productCardTitleMaxLength: number = 37 //Max length for product titles in product cards
export function truncateText(text: string, max: number): string {
  const chars = Array.from(text)
  if (chars.length <= max) return text
  return chars.slice(0, max).join('') + '...'
}
