import React, { useEffect, useRef } from 'react'

import Image from 'next/image'

import { motion } from 'framer-motion'
import styled from 'styled-components'

import { ChevronLeftIcon, ChevronRightIcon, MultiplyIcon } from '@navikt/aksel-icons'
import { Picture } from '@navikt/ds-icons'
import { Button } from '@navikt/ds-react'

import { maxWidthPhoneOnly, minWidthDesktopUp, minWidthTabletUp } from '@/utils/breakpoints'
import { largeImageLoader } from '@/utils/image-util'
import { Photo } from '@/utils/product-util'

import { SWIPE_CONFIDENCE_THRESHOLD, swipePower, variants } from './PhotoSlider'

interface PhotoSliderModalProps {
  photos: Photo[]
  modalIsOpen: boolean
  active: number
  direction: number
  src: string
  closeModal: () => void
  prevImage: () => void
  nextImage: () => void
  setActive: (active: number) => void
}

const PhotoSliderModal = ({
  photos,
  modalIsOpen,
  active,
  direction,
  src,
  closeModal,
  prevImage,
  nextImage,
  setActive,
}: PhotoSliderModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null)
  const firstFocusableElementRef = useRef<HTMLElement | null>(null)
  const lastFocusableElementRef = useRef<HTMLElement | null>(null)

  console.log('First', firstFocusableElementRef)
  console.log('Last', lastFocusableElementRef)

  useEffect(() => {
    const modalElement = modalRef.current
    if (modalElement) {
      const focusableElements = modalElement.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')

      if (focusableElements.length > 0) {
        firstFocusableElementRef.current = focusableElements[0] as HTMLElement
        lastFocusableElementRef.current = focusableElements[focusableElements.length - 1] as HTMLElement

        firstFocusableElementRef.current.focus()
      }
    }
  }, [modalIsOpen])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstFocusableElementRef.current) {
          event.preventDefault()
          lastFocusableElementRef.current?.focus()
        }
      } else {
        if (document.activeElement === lastFocusableElementRef.current) {
          event.preventDefault()
          firstFocusableElementRef.current?.focus()
        }
      }
    }
  }

  if (!photos.length) {
    return (
      <Modal ref={modalRef}>
        <ModalContent>
          <CloseButton
            onKeyDown={handleKeyDown}
            tabIndex={0}
            variant="tertiary-neutral"
            onClick={closeModal}
            icon={<MultiplyIcon title="Lukk stor visning av bilder" height={50} width={50} />}
          />
          <Picture
            width={500}
            height={500}
            style={{ background: 'white', margin: '0 auto' }}
            aria-label="Ingen bilde tilgjengelig"
          />
        </ModalContent>
      </Modal>
    )
  }

  return (
    <Modal ref={modalRef}>
      <ModalContent>
        <CloseButton
          onKeyDown={handleKeyDown}
          tabIndex={0}
          variant="tertiary-neutral"
          onClick={closeModal}
          icon={<MultiplyIcon title="Lukk stor visning av bilder" height={50} width={50} />}
        />

        <PhotoAndArrowsContainer>
          {photos.length > 1 && (
            <ArrowButton
              onKeyDown={handleKeyDown}
              tabIndex={0}
              aria-label="Forrige bilde"
              variant="tertiary-neutral"
              onClick={() => {
                prevImage()
              }}
              icon={<ChevronLeftIcon aria-hidden width={50} height={50} />}
            />
          )}

          <ImageContainer>
            <motion.div
              key={src}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x)

                if (swipe < -SWIPE_CONFIDENCE_THRESHOLD) {
                  nextImage()
                } else if (swipe > SWIPE_CONFIDENCE_THRESHOLD) {
                  prevImage()
                }
              }}
            >
              <Image
                onKeyDown={handleKeyDown}
                tabIndex={0}
                draggable="false"
                loader={largeImageLoader}
                src={src}
                alt={`Produktbilde nummer ${active + 1} av totalt ${photos.length} bilder`}
                fill
                style={{ objectFit: 'contain' }}
              />
            </motion.div>
          </ImageContainer>

          {photos.length > 1 && (
            <ArrowButton
              onKeyDown={handleKeyDown}
              tabIndex={0}
              aria-label="Neste bilde"
              variant="tertiary-neutral"
              onClick={() => {
                nextImage()
              }}
              icon={<ChevronRightIcon aria-hidden width={50} height={50} />}
            />
          )}
        </PhotoAndArrowsContainer>

        <NumberOfTotal>
          {active + 1}/{photos.length}
        </NumberOfTotal>

        {photos.length > 1 && (
          <PreviewAllPhotosContainer>
            {photos.map((photo, i) =>
              i === active ? (
                <Image
                  data-active
                  role="button"
                  key={i}
                  tabIndex={0}
                  onKeyDown={handleKeyDown}
                  onClick={() => setActive(i)}
                  loader={largeImageLoader}
                  src={photo.uri}
                  alt={`Produktbilde nummer ${i + 1} av totalt ${photos.length} bilder`}
                  fill
                  style={{ objectFit: 'scale-down' }}
                />
              ) : (
                <Image
                  role="button"
                  key={i}
                  tabIndex={0}
                  onKeyDown={handleKeyDown}
                  onClick={() => setActive(i)}
                  loader={largeImageLoader}
                  src={photo.uri}
                  alt={`Produktbilde nummer ${i + 1} av totalt ${photos.length} bilder`}
                  fill
                  style={{ objectFit: 'scale-down' }}
                  onKeyDownCapture={(event) => event.key === 'Enter' && setActive(i)}
                />
              )
            )}
          </PreviewAllPhotosContainer>
        )}
      </ModalContent>
    </Modal>
  )
}

export default PhotoSliderModal

const Modal = styled.div`
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  background-color: rgba(0, 0, 0, 0.9); /* Black w/ opacity */
`

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  gap: 1rem;
  height: 100%;
  width: 100%;
`
const CloseButton = styled(Button)`
  position: absolute;
  top: 30px;
  right: 30px;
  color: white;
  transition: 0.3s;

  &:hover,
  &:focus {
    cursor: pointer;
    background: var(--a-deepblue-800);
    border: none;
    color: white;
  }
`

const PhotoAndArrowsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`

const ImageContainer = styled.div`
  img {
    width: 300px !important;
    height: 400px !important;
    position: relative !important;
    background-color: white;
    border-radius: var(--a-border-radius-medium);

    @media (min-width: ${minWidthTabletUp}) {
      width: 600px !important;
      height: 500px !important;
    }

    @media (min-width: ${minWidthDesktopUp}) {
      width: 1000px !important;
      height: 600px !important;
    }
  }
`

const ArrowButton = styled(Button)`
  cursor: pointer;
  height: 4rem;
  color: white;

  &:hover,
  &:focus {
    background: var(--a-deepblue-800);
    color: white;
    transition: 0.3s;
  }
`

const NumberOfTotal = styled.div`
  display: flex;
  justify-content: center;
  color: white;
  font-size: var(--a-font-size-large);
`

const PreviewAllPhotosContainer = styled.div`
  @media (max-width: ${maxWidthPhoneOnly}) {
    display: none;
  }

  display: flex;
  justify-content: center;
  justify-self: center;
  gap: 2rem;
  width: 100%;

  img {
    width: 150px !important;
    height: 100px !important;
    cursor: pointer;
    position: relative !important;
    margin-top: 1rem;
    background: white;
    border-radius: var(--a-border-radius-medium);
    opacity: 0.5;

    &[data-active] {
      opacity: 1;
      cursor: not-allowed;
      position: relative !important;
      width: 150px !important;
      height: 120px !important;
      margin-top: 0;
      background: white;
      border-radius: var(--a-border-radius-medium);
    }
  }
`
