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
    if (!params.getAll(name).includes(value) && value !== '') {
      params.set(name, value)
    }

    return params
  }

  const createQueryStringMultiple = useCallback(
    (...args: { name: string; value: string }[]) => {
      let params = new URLSearchParams(searchParams.toString())

      args.forEach((arg) => (params = queryString(params, arg.name, arg.value)))

      return params.toString()
    },
    [searchParams]
  )

  const createQueryStringAppend = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (!params.getAll(name).includes(value) && value !== '') {
        params.append(name, value)
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
