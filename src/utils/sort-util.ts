const stringComparator = (c: string, d: string) => {
  // Handle special cases for "-"
  let a = c.trim().replace(/\s/g, '')
  let b = d.trim().replace(/\s/g, '')
  if (a === '-' && b !== '-') {
    return 1 // "-" should come last
  }
  if (b === '-' && a !== '-') {
    return -1 // "-" should come last
  }
  if (a < b || b === undefined) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

export const sortAlphabetically = (keyA: string, keyB: string, desc: boolean = false) => {
  return desc ? stringComparator(keyB, keyA) : stringComparator(keyA, keyB)
}

export const sortIntWithStringFallback = (keyA: string, keyB: string, desc: boolean = false) => {
  if (parseInt(keyA) && parseInt(keyB)) {
    return desc ? parseInt(keyB) - parseInt(keyA) : parseInt(keyA) - parseInt(keyB)
  }
  return desc ? stringComparator(keyB, keyA) : stringComparator(keyA, keyB)
}

export const sortWithNullValuesAtEnd = (keyA: number | null | undefined, keyB: number | null | undefined): number => {
  if (keyA === null && keyB !== null) {
    return 1
  } else if (keyA !== null && keyB === null) {
    return -1
  } else if (keyA === null && keyB === null) {
    return 0
  } else if (keyA && keyB) {
    return keyA - keyB
  } else {
    return -1
  }
}
