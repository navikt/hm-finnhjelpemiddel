import { Button, Heading, HGrid, Modal, Popover, VStack } from '@navikt/ds-react'
import { FilesIcon, TrashIcon } from '@navikt/aksel-icons'
import { ReactNode, useRef, useState } from 'react'
import styles from './MobileOverlayModal.module.scss'
import { useMobileOverlayStore } from '@/utils/global-state-util'

type MobileOverlayModalProps = {
  body: ReactNode
  onReset: () => void
}
export const MobileOverlayModal = ({ body, onReset }: MobileOverlayModalProps) => {
  const copyButtonMobileRef = useRef<HTMLButtonElement>(null)
  const [copyPopupOpenState, setCopyPopupOpenState] = useState(false)
  const { isMobileOverlayOpen, setMobileOverlayOpen } = useMobileOverlayStore()

  return (
    <Modal
      open={isMobileOverlayOpen}
      onClose={() => setMobileOverlayOpen(false)}
      aria-label={'Filtrer søket'}
      className={styles.mobileOverlay}
      width={'100%'}
      closeOnBackdropClick
    >
      <Modal.Header className={styles.mobileOverlay__header}>
        <Heading size={'medium'} level={'2'} id="modal-heading">
          Filtrer søket
        </Heading>
      </Modal.Header>
      <Modal.Body className={styles.mobileOverlay__content}>{body}</Modal.Body>
      <Modal.Footer className={styles.mobileOverlay__footer}>
        <VStack gap="2">
          <HGrid columns={{ xs: 2 }} gap="2">
            <Button
              ref={copyButtonMobileRef}
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
              anchorEl={copyButtonMobileRef.current}
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
          <Button onClick={() => setMobileOverlayOpen(false)}>Vis søkeresultater</Button>
        </VStack>
      </Modal.Footer>
    </Modal>
  )
}
