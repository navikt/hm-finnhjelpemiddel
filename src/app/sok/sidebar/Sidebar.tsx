import { useRef, useState } from 'react'

import { FilesIcon, TrashIcon } from '@navikt/aksel-icons'
import { Button, Popover } from '@navikt/ds-react'

import { FilterData } from '@/utils/api-util'

import SearchForm, { SearchFormResetHandle } from './SearchForm'

const Sidebar = ({
  filters,
  onResetSearchData,
  setFocus,
}: {
  filters?: FilterData
  onResetSearchData: () => void
  setFocus: () => void
}) => {
  const copyButtonRef = useRef<HTMLButtonElement>(null)
  const searchFormRef = useRef<SearchFormResetHandle>(null)

  const [copyPopupOpenState, setCopyPopupOpenState] = useState(false)

  const onReset = () => {
    onResetSearchData()
    searchFormRef.current && searchFormRef.current.reset()
  }

  return (
    <section className="search__side-bar">
      <SearchForm filters={filters} setFocus={setFocus} ref={searchFormRef} />
      <div className="footer">
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            ref={copyButtonRef}
            variant="tertiary"
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
            anchorEl={copyButtonRef.current}
            placement="right"
          >
            <Popover.Content>Søket er kopiert!</Popover.Content>
          </Popover>
        </div>
        <Button
          type="button"
          variant="tertiary"
          size="small"
          icon={<TrashIcon title="Nullstill søket" />}
          onClick={onReset}
        >
          Nullstill søket
        </Button>
      </div>
    </section>
  )
}

export default Sidebar
