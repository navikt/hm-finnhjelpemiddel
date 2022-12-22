import { Select } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { calculateNextAvailableIsoCategory } from '../utils/isoCategory'
import { SearchData } from '../utils/api-util'
import { useSearchDataStore } from '../utils/state-util'

const IsoCategory = () => {
  const { setValue, watch } = useFormContext<SearchData>()
  const { searchData, setSearchData } = useSearchDataStore()

  watch(({ isoCode }) => isoCode && setSearchData({ isoCode }))

  const levels = searchData.isoCode.length / 2

  return (
    <>
      <Select
        label={`Kategori`}
        className="search__iso-category-select"
        onChange={(e) => setValue('isoCode', e.target.value)}
      >
        <option value="">Velg kategori</option>
        {calculateNextAvailableIsoCategory(searchData.isoCode, 0).map(([isoCode, title]) => (
          <option key={isoCode} value={isoCode}>
            {title}
          </option>
        ))}
      </Select>
      {[...Array(levels).keys()].map((_level) => {
        const level = _level + 1
        const nextCategories = calculateNextAvailableIsoCategory(searchData.isoCode, level)

        const updateIsoCode = (iso: string, index: number) => {
          let isoCode = iso !== '' ? iso.slice(0, (index + 1) * 2) : searchData.isoCode.slice(0, (index + 1) * 2 - 2)
          setValue('isoCode', isoCode)
        }

        return (
          nextCategories.length > 0 && (
            <Select
              key={level}
              className="search__iso-category-select"
              label={`Underkategori ${level}`}
              onChange={(e) => updateIsoCode(e.target.value, level)}
            >
              <option value="">Velg underkategori</option>
              {nextCategories.map(([isoCode, title]) => (
                <option key={isoCode} value={isoCode}>
                  {title}
                </option>
              ))}
            </Select>
          )
        )
      })}
    </>
  )
}

export default IsoCategory
