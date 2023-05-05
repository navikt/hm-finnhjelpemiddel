import { useRef, useState } from 'react'
import { Button, Popover } from '@navikt/ds-react'
import { Delete } from '@navikt/ds-icons'
import { FilesIcon } from '@navikt/aksel-icons'
import { FilterData } from '../../utils/api-util'

import SearchForm from '../SearchForm'

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
  const [copyPopupOpenState, setCopyPopupOpenState] = useState(false)

  return (
    <section className="search__side-bar">
      <SearchForm filters={filters} setFocus={setFocus} />
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
          icon={<Delete title="Nullstill søket" />}
          onClick={onResetSearchData}
        >
          Nullstill søket
        </Button>
      </div>
    </section>
  )
}

export default Sidebar
