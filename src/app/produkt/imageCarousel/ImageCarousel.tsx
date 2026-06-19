'use client'

import { Photo } from '@/utils/product-util'
import useEmblaCarousel, { EmblaViewportRefType } from 'embla-carousel-react'
import styles from './ImageCarousel.module.scss'
import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { largeImageLoader } from '@/utils/image-util'
import { BodyShort, Button, Dialog, Hide, HStack, VStack } from '@navikt/ds-react'
import { CameraIcon, ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons'
import { usePrevNextButtons } from '@/app/produkt/imageCarousel/UsePrevNextButtons'
import { Thumb } from '@/app/produkt/imageCarousel/Thumb'
import { EmblaCarouselType } from 'embla-carousel'

export const ImageCarousel = ({ images }: { images: Photo[] }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({
    startIndex: selectedIndex,
  })

  if (images.length === 0) {
    return <CameraIcon width={400} height={300} style={{ background: 'white' }} aria-label="Ingen bilde tilgjengelig" />
  }

  return (
    <VStack gap={'space-16'} className={styles.embla}>
      <ImageDialog
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        images={images}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />

      <div style={{ position: 'relative' }}>
        <button
          aria-label="Gå til fullskjermmodus"
          onClick={() => setModalIsOpen(true)}
          className={styles.fullscreenButtonKeyboard}
        />
        <button aria-label="Gå til fullskjermmodus" onClick={() => setModalIsOpen(true)} className={styles.imageButton}>
          <BigImage emblaMainRef={emblaMainRef} images={images} />
        </button>
      </div>

      {emblaMainApi && (
        <ThumbnailBar
          images={images}
          emblaApi={emblaMainApi}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          isModal={false}
          setModalIsOpen={setModalIsOpen}
        />
      )}
    </VStack>
  )
}

const BigImage = ({ emblaMainRef, images }: { emblaMainRef: EmblaViewportRefType; images: Photo[] }) => {
  return (
    <div className={styles.embla__viewport} ref={emblaMainRef}>
      <div className={styles.embla__container}>
        {images.map((image, index) => (
          <div className={styles.emblaSlide} key={index}>
            {
              <Image
                loader={largeImageLoader}
                src={image.uri}
                alt={`Produktbilde ${index + 1} av ${images.length}`}
                fill
                sizes={'(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
                className={styles.image}
              />
            }
          </div>
        ))}
      </div>
    </div>
  )
}

const ImageDialog = ({
  modalIsOpen,
  setModalIsOpen,
  images,
  selectedIndex,
  setSelectedIndex,
}: {
  modalIsOpen: boolean
  setModalIsOpen: (value: boolean) => void
  images: Photo[]
  selectedIndex: number
  setSelectedIndex: (index: number) => void
}) => {
  const [emblaDialogRef, emblaDialogApi] = useEmblaCarousel({
    startIndex: selectedIndex,
  })

  return (
    <Dialog open={modalIsOpen} onOpenChange={() => setModalIsOpen(!modalIsOpen)}>
      <Dialog.Popup position={'fullscreen'} aria-label={'Bildekarusell i fullskjerm'}>
        <Dialog.Header withClosebutton />
        <Dialog.Body>
          <VStack gap={'space-16'} className={styles.modalContainer}>
            <BigImage emblaMainRef={emblaDialogRef} images={images} />

            <ThumbnailBar
              images={images}
              emblaApi={emblaDialogApi}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              isModal={true}
              setModalIsOpen={setModalIsOpen}
            />
          </VStack>
        </Dialog.Body>
      </Dialog.Popup>
    </Dialog>
  )
}

const ThumbnailBar = ({
  images,
  emblaApi,
  selectedIndex,
  setSelectedIndex,
  isModal,
  setModalIsOpen,
}: {
  images: Photo[]
  emblaApi: EmblaCarouselType | undefined
  selectedIndex: number
  setSelectedIndex: (index: number) => void
  isModal: boolean
  setModalIsOpen: (value: boolean) => void
}) => {
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  })
  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaApi || !emblaThumbsApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi, emblaThumbsApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi || !emblaThumbsApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaApi.selectedScrollSnap())
  }, [emblaApi, emblaThumbsApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()

    emblaApi.on('select', onSelect).on('reInit', onSelect)
  }, [emblaApi, onSelect])

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi)

  useEffect(() => {
    const handleArrowKeys = (event: KeyboardEvent) => {
      if (isModal && (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Escape')) {
        event.preventDefault()
        if (event.key === 'ArrowLeft') {
          onPrevButtonClick()
        } else if (event.key === 'ArrowRight') {
          onNextButtonClick()
        } else if (event.key === 'Escape') {
          setModalIsOpen(false)
        }
      }
    }
    window.addEventListener('keydown', handleArrowKeys)

    return () => {
      window.removeEventListener('keydown', handleArrowKeys)
    }
  }, [isModal, setModalIsOpen, onPrevButtonClick, onNextButtonClick])

  return (
    <HStack gap={'space-8'} align={'center'} justify={'center'} style={{ position: 'relative', zIndex: '100' }}>
      <Button
        aria-label="Forrige bilde"
        variant="tertiary"
        onClick={onPrevButtonClick}
        icon={<ChevronLeftIcon aria-hidden height={40} width={40} />}
        disabled={prevBtnDisabled}
      />
      <Hide below={'lg'}>
        <div className={styles.emblaThumbs__viewport} ref={emblaThumbsRef}>
          <HStack wrap={false} gap={'space-8'}>
            {images.map((image, index) => (
              <Thumb
                imageUri={image.uri}
                key={index}
                onClick={() => onThumbClick(index)}
                selected={index === selectedIndex}
                index={index}
              />
            ))}
          </HStack>
        </div>
      </Hide>
      <Hide above={'lg'}>
        <BodyShort size="large">
          {selectedIndex + 1} / {images.length}
        </BodyShort>
      </Hide>
      <Button
        aria-label="Neste bilde"
        variant="tertiary"
        onClick={onNextButtonClick}
        icon={<ChevronRightIcon aria-hidden height={40} width={40} />}
        disabled={nextBtnDisabled}
      />
    </HStack>
  )
}
