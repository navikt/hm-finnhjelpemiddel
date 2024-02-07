import { useEffect } from 'react'

import Image from 'next/image'

import { motion } from 'framer-motion'

import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons'
import { Button, Modal } from '@navikt/ds-react'

import { largeImageLoader } from '@/utils/image-util'
import { Photo } from '@/utils/product-util'

import { SWIPE_CONFIDENCE_THRESHOLD, swipePower, variants } from './PhotoSlider'
import './product-page.scss'

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

  return (
    <Modal
      className="picture-modal"
      portal={true}
      open={modalIsOpen}
      header={{
        heading: '',
        closeButton: true,
      }}
      onClose={() => {
        setModalIsOpen(false)
      }}
      aria-label="Modal"
      aria-labelledby="stor bildevisning"
    >
      <Modal.Body className="picture-modal__modal-body">
        <div className="picture-modal__photo-and-arrows-container">
          {photos.length > 1 && (
            <Button
              className="arrow-button"
              tabIndex={0}
              aria-label="Forrige bilde"
              variant="tertiary-neutral"
              onClick={() => {
                prevImage()
              }}
              icon={<ChevronLeftIcon aria-hidden width={50} height={50} />}
            />
          )}

          <div className="picture-modal__image-container">
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
          </div>

          {photos.length > 1 && (
            <Button
              className="picture-modal__arrow-button"
              tabIndex={0}
              aria-label="Neste bilde"
              variant="tertiary-neutral"
              onClick={() => {
                nextImage()
              }}
              icon={<ChevronRightIcon aria-hidden width={50} height={50} />}
            />
          )}
        </div>

        <div className="picture-modal__number-of-total">
          {active + 1}/{photos.length}
        </div>

        {photos.length > 1 && (
          <div className="picture-modal__preview-container">
            {photos.map((photo, i) => (
              <div
                className="picture-modal__thumbnail-image-container"
                key={i}
                data-active={i === active ? '' : undefined}
              >
                <Image
                  aria-selected={true}
                  onClick={() => setActive(i)}
                  loader={largeImageLoader}
                  src={photo.uri}
                  alt={`Produktbilde ${i + 1} av ${photos.length}`}
                  fill
                />
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default PhotoSliderModal
