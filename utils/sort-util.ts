export const sortAlphabetically = (keyA: string, keyB: string, desc: boolean = true) => {
  const comparator = (a: string, b: string) => {
    if (a < b || b === undefined) {
      return -1
    }
    if (a > b) {
      return 1
    }
    return 0
  }

  return desc ? comparator(keyA, keyB) : comparator(keyB, keyA)
}
