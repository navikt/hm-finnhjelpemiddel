import { Button, HStack, Select, VStack } from '@navikt/ds-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import styles from './FilterRow.module.scss'

type Props = {
  rows: { [key: string]: string[] }
  filterNames: string[]
}

export const FilterRow = ({ rows, filterNames }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const filters: { [key: string]: string[] } = Object.assign(
    {},
    ...filterNames.map((name) => {
      if (Object.entries(rows).filter(([key, _]) => key.startsWith(name)).length > 1) {
        //Størrelsefelt har min og maks

        const allValues = Object.entries(rows)
          .filter(([key, _]) => key.startsWith(name))
          .flatMap(([_, value]) => value)
          .map((value) => parseInt(value))

        const rangeOfNumbers = (a: number, b: number) => [...Array(b - a + 1)].map((_, i) => i + a)
        const valueIntervals = rangeOfNumbers(Math.min(...allValues), Math.max(...allValues))

        return {
          [name]: valueIntervals.map((value) => `${value} cm`),
        }
      }

      return {
        [name]: Array.from(
          new Set(
            Object.entries(rows)
              .filter(([key, _]) => key === name)
              .flatMap(([_, value]) => value)
          )
        ).sort(),
      }
    })
  )

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value.length === 0) {
        params.delete(name)
      } else {
        params.set(name, value)
      }

      return params.toString()
    },
    [searchParams]
  )

  const onSelectFilter = (name: string, value: string) => {
    const newSearchParams = createQueryString(name, value)
    router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
  }

  const resetFilterAll = () => {
    router.replace(`${pathname}`, { scroll: false })
  }

  return (
    <VStack gap={'4'}>
      <HStack gap={'4'} width={'fit-content'} maxWidth={'40%'}>
        <SeteSelect filters={filters} selectFilter={onSelectFilter} />
      </HStack>
      <Button size={'small'} onClick={resetFilterAll} className={styles.fjernButton}>
        Fjern alle filtre
      </Button>
    </VStack>
  )
}

const SeteSelect = ({
  filters,
  selectFilter,
}: {
  filters: { [_: string]: string[] }
  selectFilter: (name: string, value: string) => void
}) => {
  const searchParams = useSearchParams()
  return (
    <>
      {Object.entries(filters).map(([key, row], index) => {
        return (
          <Select
            key={index + 1}
            label={key}
            onChange={(event) => selectFilter(key, event.target.value)}
            value={searchParams.get(key) ?? ''}
          >
            <option key="" value="">
              Velg
            </option>
            {row.map((value, i) => (
              <option key={i + 1}>{value}</option>
            ))}
          </Select>
        )
      })}
    </>
  )
}
