import { useEffect } from 'react'
import { Select } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { getIsoCodeLevels, getIsoCategoriesForLevel, getIsoCodeForLevel } from '../utils/iso-category-util'
import { SearchData } from '../utils/api-util'
import { useSearchDataStore } from '../utils/state-util'

const SelectIsoCategory = () => {
  const { searchData, setSearchData } = useSearchDataStore()
  const { setValue, watch } = useFormContext<SearchData>()
  const watchIsoCode = watch('isoCode')

  useEffect(() => {
    setSearchData({ isoCode: watchIsoCode ?? '' })
  }, [setSearchData, watchIsoCode])

  useEffect(() => {
    if (searchData.isoCode) {
      setValue('isoCode', searchData.isoCode)
    }
  }, [searchData.isoCode, setValue])

  const levels = getIsoCodeLevels(searchData.isoCode)

  return (
    <>
      <Select
        label={`Kategori`}
        className="search__iso-category-select"
        onChange={(e) => setValue('isoCode', e.target.value, { shouldDirty: true })}
        value={getIsoCodeForLevel(searchData.isoCode, 1)}
      >
        <option value="">Velg kategori</option>
        {getIsoCategoriesForLevel(searchData.isoCode, 1).map(([isoCode, title]) => (
          <option key={isoCode} value={isoCode}>
            {title}
          </option>
        ))}
      </Select>
      {levels?.map((_, index) => {
        const level = index + 1
        const nextLevel = level + 1
        const nextCategories = getIsoCategoriesForLevel(searchData.isoCode, nextLevel)

        const updateIsoCode = (isoCode: string) => {
          setValue('isoCode', isoCode || getIsoCodeForLevel(searchData.isoCode, level), { shouldDirty: true })
        }

        return (
          nextCategories.length > 0 && (
            <Select
              key={nextLevel}
              className="search__iso-category-select"
              label={`Underkategori ${level}`}
              onChange={(e) => updateIsoCode(e.target.value)}
              value={getIsoCodeForLevel(searchData.isoCode, nextLevel)}
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

export default SelectIsoCategory
