import { Bucket } from '@/utils/api-util'
import { usePathname, useRouter } from 'next/navigation'
import useQueryString from '@/utils/search-params-util'
import { Select } from '@navikt/ds-react'

type SupplierSelectProps = {
  supplierNames: Bucket[] | undefined
  selectChange: (value: string) => void
  selectedValue: string
}
export const SupplierSelect = ({ supplierNames, selectChange, selectedValue }: SupplierSelectProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const { createQueryStringMultiple, searchParamKeys } = useQueryString()

  const onSupplierChange = (supplier: string) => {
    selectChange(supplier)


    const newParamsWithSupplier = createQueryStringMultiple(
      { name: searchParamKeys.supplier, value: supplier },
      { name: searchParamKeys.page, value: '1' }
    )
    if(supplier.length > 0) {
      router.push(`${pathname}?${newParamsWithSupplier}`, { scroll: false })
    } else {
      router.push(`${pathname}?$page=1`, { scroll: false })
    }

  }

  return (
    <Select
      label="Leverandør"
      onChange={(option) => {
        onSupplierChange(option.target.value)
      }}
      value={selectedValue}
    >
      <option key={0} value={''}>
        Alle
      </option>
      {supplierNames &&
        supplierNames.map((supplier, i) => (
          <option key={i + 1} value={supplier.key}>
            {supplier.key}
          </option>
        ))}
    </Select>
  )
}
