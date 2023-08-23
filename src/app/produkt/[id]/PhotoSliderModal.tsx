import { useEffect, useRef } from 'react'

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
  const ref = useRef<HTMLDialogElement>(null)

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

  return (
    <Modal
      ref={ref}
      closeButton={true}
      open={modalIsOpen}
      onClose={() => setModalIsOpen(false)}
      aria-label="Modal demo"
      aria-labelledby="modal-heading"
    >
      <ModalContent>
        <PhotoAndArrowsContainer>
          {photos.length > 1 && (
            <ArrowButton
              tabIndex={0}
              aria-label="Forrige bilde"
              variant="tertiary-neutral"
              onClick={() => {
                prevImage()
              }}
              icon={<ChevronLeftIcon aria-hidden width={30} height={30} />}
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
              icon={<ChevronRightIcon aria-hidden width={30} height={30} />}
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
                  aria-selected={true}
                  key={i}
                  tabIndex={0}
                  onClick={() => setActive(i)}
                  loader={largeImageLoader}
                  src={photo.uri}
                  alt={`Produktbilde ${i + 1} av ${photos.length}`}
                  fill
                  style={{ objectFit: 'scale-down' }}
                />
              ) : (
                <Image
                  role="button"
                  key={i}
                  tabIndex={0}
                  onClick={() => setActive(i)}
                  loader={largeImageLoader}
                  src={photo.uri}
                  alt={`Produktbilde ${i + 1} av ${photos.length}`}
                  fill
                  style={{ objectFit: 'scale-down' }}
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

const ModalContent = styled(Modal.Content)`
  margin: 2rem;
  padding: 0;

  @media (min-width: ${minWidthTabletUp}) {
    margin: 0;
  }
`

const PhotoAndArrowsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 0 1rem;
`

const ImageContainer = styled.div`
  img {
    width: 300px !important;
    height: 300px !important;
    position: relative !important;
    border-radius: var(--a-border-radius-medium);

    @media (min-width: ${minWidthTabletUp}) {
      width: 600px !important;
      height: 400px !important;
    }

    @media (min-width: ${minWidthDesktopUp}) {
      width: 1000px !important;
      height: 600px !important;
    }
  }
`

const ArrowButton = styled(Button)`
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
  justify-self: center;
  gap: 1rem;
  width: 100%;
  border-top: rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  background-color: #edac9e;

  img {
    width: 150px !important;
    height: 100px !important;
    cursor: pointer;
    position: relative !important;
    border-radius: var(--a-border-radius-medium);
    margin-top: 15px;
    background: white;

    &[data-active] {
      background: white;
      margin-top: 0;
      width: 150px !important;
      height: 130px !important;
      cursor: not-allowed;
      position: relative !important;
      border-radius: var(--a-border-radius-medium);
      box-shadow: var(--a-shadow-small);
    }
  }
`
