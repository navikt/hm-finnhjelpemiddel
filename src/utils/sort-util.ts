const stringComparator = (a: string, b: string) => {
  // Handle special cases for "-"
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
  const keyALower = keyA.toLowerCase()
  const keyBLower = keyB.toLowerCase()
  return desc ? stringComparator(keyBLower, keyALower) : stringComparator(keyALower, keyBLower)
}

export const sortIntWithStringFallback = (keyA: string, keyB: string, desc: boolean = false) => {
  // Handle special cases for "-"
  if (keyA === '-' && keyB !== '-') {
    return 1 // "-" should come last
  }
  if (keyB === '-' && keyA !== '-') {
    return -1 // "-" should come last
  }
  if (parseFloat(keyA) && parseFloat(keyB)) {
    return desc ? parseFloat(keyB) - parseFloat(keyA) : parseFloat(keyA) - parseFloat(keyB)
  }

  return desc ? stringComparator(keyB, keyA) : stringComparator(keyA, keyB)
}
