const comparatoString = (a: string, b: string) => {
  if (a < b || b === undefined) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

export const sortAlphabetically = (keyA: string, keyB: string, desc: boolean = false) => {
  return desc ? comparatoString(keyB, keyA) : comparatoString(keyA, keyB)
}

export const sortIntWithStringFallback = (keyA: string, keyB: string, desc: boolean = false) => {
  if (parseInt(keyA) && parseInt(keyB)) {
    return desc ? parseInt(keyB) - parseInt(keyA) : parseInt(keyA) - parseInt(keyB)
  }

  return desc ? comparatoString(keyB, keyA) : comparatoString(keyA, keyB)
}
