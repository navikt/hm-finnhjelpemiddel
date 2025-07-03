import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export default function useQueryString() {
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      return queryString(params, name, value).toString()
    },
    [searchParams]
  )

  const queryString = (params: URLSearchParams, name: string, value: string) => {
    if (value === '') {
      params.delete(name)
    } else if (!params.getAll(name).includes(value)) {
      params.set(name, value)
    }

    return params
  }

  const createQueryStringMultiple = useCallback(
    (...args: { name: string; value: string }[]) => {
      let params = new URLSearchParams(searchParams.toString())

      args.forEach((arg) => (params = queryString(params, arg.name, arg.value)))

      console.log('args', args)
      return params.toString()
    },
    [searchParams]
  )

  const createQueryStringAppend = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value === '') {
        params.delete(name)
      } else if (params.getAll(name).includes(value)) {
        params.delete(name, value)
      } else if (params.has(name)) {
        params.append(name, value)
      } else {
        params.set(name, value)
      }

      return params.toString()
    },
    [searchParams]
  )

  enum searchParamKeys {
    tab = 'tab',
    page = 'page',
    searchTerm = 'searchTerm',
    supplier = 'supplier',
  }

  return {
    createQueryString,
    createQueryStringAppend,
    createQueryStringMultiple,
    searchParamKeys,
  }
}
