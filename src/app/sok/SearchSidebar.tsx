import SearchForm from '@/app/sok/SearchForm'
import { Button, HGrid, Popover } from '@navikt/ds-react'
import { FilesIcon, TrashIcon } from '@navikt/aksel-icons'
import { FilterData } from '@/utils/api-util'
import { RefObject, useRef, useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { FormSearchData } from '@/utils/search-state-util'

type SearchSidebarProps = {
  onSubmit: SubmitHandler<FormSearchData>
  filters: FilterData
  searchFormRef: RefObject<HTMLFormElement | null>
  onReset: () => void
}

export const SearchSidebar = ({ onSubmit, filters, searchFormRef, onReset }: SearchSidebarProps) => {
  const copyButtonDesktopRef = useRef<HTMLButtonElement>(null)
  const [copyPopupOpenState, setCopyPopupOpenState] = useState(false)

  return (
    <section className="filter-container">
      <SearchForm onSubmit={onSubmit} filters={filters} ref={searchFormRef} />
      <HGrid columns={{ xs: 2 }} className="filter-container__footer" gap="2">
        <Button
          ref={copyButtonDesktopRef}
          variant="secondary"
          size="small"
          icon={<FilesIcon title="Kopiér søket til utklippstavlen" />}
          onClick={() => {
            navigator.clipboard.writeText(location.href)
            setCopyPopupOpenState(true)
          }}
        >
          Kopiér søket
        </Button>
        <Popover
          open={copyPopupOpenState}
          onClose={() => setCopyPopupOpenState(false)}
          anchorEl={copyButtonDesktopRef.current}
          placement="right"
        >
          <Popover.Content>Søket er kopiert!</Popover.Content>
        </Popover>
        <Button
          type="button"
          variant="secondary"
          size="small"
          icon={<TrashIcon title="Nullstill søket" />}
          onClick={onReset}
        >
          Nullstill søket
        </Button>
      </HGrid>
    </section>
  )
}
