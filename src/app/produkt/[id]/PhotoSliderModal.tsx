import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import { motion } from 'framer-motion'
import styled from 'styled-components'

import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons'
import { Button, Modal } from '@navikt/ds-react'

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
  setModalIsOpen: (open: boolean) => void
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
  setModalIsOpen,
  prevImage,
  nextImage,
  setActive,
}: PhotoSliderModalProps) => {
  useEffect(() => {
    const handleArrowKeys = (event: KeyboardEvent) => {
      if (modalIsOpen && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        event.preventDefault()
        if (event.key === 'ArrowLeft') {
          prevImage()
        } else if (event.key === 'ArrowRight') {
          nextImage()
        }
      }
    }
    window.addEventListener('keydown', handleArrowKeys)

    return () => {
      window.removeEventListener('keydown', handleArrowKeys)
    }
  }, [modalIsOpen, prevImage, nextImage])

  const modalContainer = document.getElementById('modal-container')
  if (!modalContainer) return null

  return createPortal(
    <StyledModal
      open={modalIsOpen}
      header={{
        heading: '',
        closeButton: true,
      }}
      onClose={() => setModalIsOpen(false)}
      aria-label="Modal"
      aria-labelledby="stor bildevisning"
    >
      <ModalBody>
        <PhotoAndArrowsContainer>
          {photos.length > 1 && (
            <ArrowButton
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
              initial={'visible'}
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
                tabIndex={0}
                draggable="false"
                loader={largeImageLoader}
                src={src}
                alt={`Produktbilde ${active + 1} av ${photos.length}`}
                fill
                style={{ objectFit: 'contain' }}
              />
            </motion.div>
          </ImageContainer>

          {photos.length > 1 && (
            <ArrowButton
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
            {photos.map((photo, i) => (
              <ThumbnailImageContainer key={i} tabIndex={0} data-active={i === active ? '' : undefined}>
                <Image
                  aria-selected={true}
                  onClick={() => setActive(i)}
                  loader={largeImageLoader}
                  src={photo.uri}
                  alt={`Produktbilde ${i + 1} av ${photos.length}`}
                  fill
                />
              </ThumbnailImageContainer>
            ))}
          </PreviewAllPhotosContainer>
        )}
      </ModalBody>
    </StyledModal>,
    modalContainer
  )
}

export default PhotoSliderModal

const StyledModal = styled(Modal)`
  width: 100vw;
  height: 100vh;

  @media (min-width: ${minWidthTabletUp}) {
    max-height: 80%;
    max-width: 90% !important;
  }

  @media (min-width: ${minWidthDesktopUp}) {
    max-width: 70% !important;
  }
`
const ModalBody = styled(Modal.Body)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0;
  flex: 2;
`

const PhotoAndArrowsContainer = styled.div`
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  @media (min-width: ${minWidthTabletUp}) {
    margin: 0 1rem;
  }
`

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  flex: 2;

  div {
    flex: 2;

    img {
      position: relative !important;
      border-radius: var(--a-border-radius-medium);
      object-fit: contain;
      max-height: 400px;
    }
  }
`

const ArrowButton = styled(Button)`
  padding: 0;
  flex: 0;
  cursor: pointer;
  color: black;

  &:hover,
  &:focus {
    background: var(--a-deepblue-800);
    color: white;
    transition: 0.3s;
  }
`

const NumberOfTotal = styled.div`
  @media (min-width: ${minWidthTabletUp}) {
    display: none;
  }

  display: flex;
  justify-content: center;
  font-size: var(--a-font-size-large);
`

const PreviewAllPhotosContainer = styled.div`
  @media (max-width: ${maxWidthPhoneOnly}) {
    display: none;
  }
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  width: 100%;
  border-top: rgba(0, 0, 0, 0.1);
  padding: 2rem 1rem;
  background-color: #edac9e;
`

const ThumbnailImageContainer = styled.div`
  height: 80%;
  width: 150px !important;
  cursor: pointer;
  position: relative !important;
  border-radius: var(--a-border-radius-medium);
  background: white;

  &[data-active] {
    height: 100%;
    cursor: not-allowed;
    box-shadow: var(--a-shadow-medium);
    width: 170px !important;
  }

  img {
    position: relative !important;
    border-radius: var(--a-border-radius-medium);
    max-height: 100px !important;
    object-fit: content;
  }
`
