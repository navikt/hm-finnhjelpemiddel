export const capitalize = (str: string) => str.toLowerCase().charAt(0).toUpperCase() + str.toLowerCase().slice(1)

// Rules from Språkrådet: https://www.sprakradet.no/sprakhjelp/Skriveregler/Mellomrom/
export const toValueAndUnit = (value: string, unit: string) => {
  if (unit === '"' || unit === "'" || unit === '°') {
    return value + unit
  }

  return `${value} ${unit}`
}
