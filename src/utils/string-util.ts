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
  const month = date.getMonth()
  const year = date.getFullYear()

  return `${day}.${month}.${year}`
}
