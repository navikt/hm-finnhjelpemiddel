import MobileOverlay from '@/components/MobileOverlay'
import { FilterData } from '@/utils/api-util'
import { FilesIcon, TrashIcon } from '@navikt/aksel-icons'
import { Button, HStack, Heading, Popover, VStack } from '@navikt/ds-react'
import { RefObject, useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { AgreementSearchData } from './AgreementSearch'
import FilterForm from './FilterForm'

const FilterMobile = ({
  filters,
  onSubmit,
  onReset,
  searchFormRef,
  copyButtonRef,
}: {
  filters: FilterData
  onSubmit: SubmitHandler<AgreementSearchData>
  onReset: () => void
  searchFormRef: RefObject<HTMLFormElement>
  copyButtonRef: RefObject<HTMLButtonElement>
}) => {
  const [mobileOverlayOpen, setMobileOverlayOpen] = useState(false)
  const [copyPopupOpenState, setCopyPopupOpenState] = useState(false)

  return (
    <div>
      <Button variant="secondary" onClick={() => setMobileOverlayOpen(true)}>
        Endre søk
      </Button>

      <MobileOverlay open={mobileOverlayOpen}>
        <MobileOverlay.Header onClose={() => setMobileOverlayOpen(false)}>
          <Heading level="1" size="medium">
            Filtrer søket
          </Heading>
        </MobileOverlay.Header>
        <MobileOverlay.Content>
          <FilterForm onSubmit={onSubmit} ref={searchFormRef} filters={filters} />
        </MobileOverlay.Content>
        <MobileOverlay.Footer>
          <VStack>
            <HStack className="search-filter__footer" gap="2">
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

              <Button
                type="button"
                variant="tertiary"
                size="small"
                icon={<TrashIcon title="Nullstill søket" />}
                onClick={onReset}
              >
                Nullstill søket
              </Button>
            </HStack>
            <Button onClick={() => setMobileOverlayOpen(false)}>Vis søkeresultater</Button>
          </VStack>
        </MobileOverlay.Footer>
      </MobileOverlay>
    </div>
  )
}

export default FilterMobile
