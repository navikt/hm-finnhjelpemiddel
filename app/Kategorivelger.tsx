import { Select } from '@navikt/ds-react'
import { UseFormRegister } from 'react-hook-form'
import { calculateNextAvailableIsoCategory } from '../utils/isoCategory'
import { SearchData } from '../utils/api-util'

type KategorivelgerProps = {
  selectedIsoCode: string
  setSelectedIsoCode: (isoCode: string) => void
  register: UseFormRegister<SearchData>
}

const Kategorivelger = ({ selectedIsoCode, setSelectedIsoCode, register }: KategorivelgerProps) => {
  const levels = selectedIsoCode.length / 2

  return (
    <>
      <Select
        label={`Kategori`}
        className="search__iso-category-select"
        {...register('isoCode', { onChange: (e) => setSelectedIsoCode(e.target.value) })}
      >
        <option value="">Velg kategori</option>
        {calculateNextAvailableIsoCategory(selectedIsoCode, 0).map(([isoCode, title]) => (
          <option key={isoCode} value={isoCode}>
            {title}
          </option>
        ))}
      </Select>
      {[...Array(levels).keys()].map((_level) => {
        const level = _level + 1
        const nextCategories = calculateNextAvailableIsoCategory(selectedIsoCode, level)

        const updateIsoCode = (iso: string, index: number) => {
          let isocode =
            iso !== ''
              ? iso.slice(0, (index + 1) * 2)
              : selectedIsoCode.slice(0, (index + 1) * 2 - 2)
          setSelectedIsoCode(isocode)
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
