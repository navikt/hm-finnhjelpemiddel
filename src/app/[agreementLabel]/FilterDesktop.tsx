'use client'
import { FilesIcon, TrashIcon } from '@navikt/aksel-icons'
import { Button, Popover } from '@navikt/ds-react'
import { useRef } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { AgreementSearchData } from './AgreementSearch'
import FilterForm from './FilterForm'

const FilterDesktop = (onSubmit: SubmitHandler<AgreementSearchData>) => {
  const copyButtonRef = useRef<HTMLButtonElement>(null)
  const searchFormRef = useRef<HTMLFormElement>(null)
  const [copyPopupOpenState, setCopyPopupOpenState] = useState(false)
  const [mobileOverlayOpen, setMobileOverlayOpen] = useState(false)

  return (
    <section className="search__side-bar">
      <FilterForm onSubmit={onSubmit} ref={searchFormRef} />
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
