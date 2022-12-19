import { Select } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { calculateNextAvailableIsoCategory } from '../utils/isoCategory'
import { SearchData } from '../utils/api-util'
import { useSearchDataStore } from '../utils/state-util'

const Kategorivelger = () => {
  const { register } = useFormContext<SearchData>()
  const { searchData, setSearchData } = useSearchDataStore()

  const levels = searchData.isoCode.length / 2

  return (
    <>
      <Select
        label={`Kategori`}
        className="search__iso-category-select"
        {...register('isoCode', { onChange: (e) => setSearchData({ isoCode: e.target.value }) })}
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
          setSearchData({ isoCode })
        }

        return (
          nextCategories.length > 0 && (
            <Select
              label={`Underkategori ${level}`}
              onChange={(e) => updateIsoCode(e.target.value, level)}
              className="search__iso-category-select"
              key={level}
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

export default Kategorivelger
