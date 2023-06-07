export type AtLeastOne<T> = { [K in keyof T]: Pick<T, K> }[keyof T]
export type Entries<T> = { [K in keyof T]: [key: K, value: T[K]] }[keyof T][]
