import { Button, HGrid, Popover } from '@navikt/ds-react'
import { FilesIcon, TrashIcon } from '@navikt/aksel-icons'
import { FilterData } from '@/utils/api-util'
import { useRef, useState } from 'react'
import KategoriFilterView from '@/app/kategori/bevegelse/manuelle-rullestoler/KategoriFilterView'

type SearchSidebarProps = {
  filters: FilterData
  onReset: () => void
}

export const KategoriSidebar = ({ filters, onReset }: SearchSidebarProps) => {
  const copyButtonDesktopRef = useRef<HTMLButtonElement>(null)
  const [copyPopupOpenState, setCopyPopupOpenState] = useState(false)

  return (
    <section className="filter-container">
      <KategoriFilterView filters={filters} />

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
