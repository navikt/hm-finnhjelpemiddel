import { Select } from '@navikt/ds-react'
import { calculateNextAvailableIsoCategory } from '../../utils/isoCategory'

type KategorivelgerProps = {
  selectedIsoCode: string
  setSelectedIsoCode: (isoCode: string) => void
}

const Kategorivelger = ({ selectedIsoCode, setSelectedIsoCode }: KategorivelgerProps) => {
  const levels = selectedIsoCode.length / 2 + 1

  return (
    <>
      {[...Array(levels).keys()].map((level) => {
        const nextCategories = calculateNextAvailableIsoCategory(selectedIsoCode, level)

        const updateIsoCode = (iso: string, index: number) => {
          let isocode = iso !== '' ? iso.slice(0, (index + 1) * 2) : selectedIsoCode.slice(0, (index + 1) * 2 - 2)
          setSelectedIsoCode(isocode)
        }
        return (
          nextCategories.length > 0 && (
            <Select
              label={`Velg kategori ${level + 1}`}
              onChange={(e) => updateIsoCode(e.target.value, level)}
              className="search__iso-category-select"
              key={level}
            >
              <option value="">Velg kategori</option>
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
