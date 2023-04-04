const comparatoString = (a: string, b: string) => {
  if (a < b || b === undefined) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

export const sortAlphabetically = (keyA: string, keyB: string, desc: boolean = true) => {
  return desc ? comparatoString(keyA, keyB) : comparatoString(keyB, keyA)
}

export const sortBredde = (keyA: string, keyB: string, desc: boolean = false) => {
  if (parseInt(keyA) && parseInt(keyB)) {
    return desc ? parseInt(keyB) - parseInt(keyA) : parseInt(keyA) - parseInt(keyB)
  }

  console.log(keyA, keyB, comparatoString(keyA, keyB))
  return desc ? comparatoString(keyA, keyB) : comparatoString(keyB, keyA)
}
