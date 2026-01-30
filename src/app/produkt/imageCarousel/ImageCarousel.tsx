'use client'

import { Photo } from '@/utils/product-util'
import useEmblaCarousel from 'embla-carousel-react'
import styles from './ImageCarousel.module.scss'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { largeImageLoader } from '@/utils/image-util'
import { BodyShort, Button, Hide, HStack, VStack } from '@navikt/ds-react'
import { CameraIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@navikt/aksel-icons'
import { usePrevNextButtons } from '@/app/produkt/imageCarousel/UsePrevNextButtons'
import { Thumb } from '@/app/produkt/imageCarousel/Thumb'

const ImageCarousel = ({ images }: { images: Photo[] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({
    startIndex: selectedIndex,
  })
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  })

  const [modalIsOpen, setModalIsOpen] = useState(false)

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaMainApi) return
    onSelect()

    emblaMainApi.on('select', onSelect).on('reInit', onSelect)
  }, [emblaMainApi, onSelect])

  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!modalIsOpen) {
      dialogRef.current?.close()
      document.body.classList.remove('navds-modal__document-body')
    } else if (modalIsOpen) {
      dialogRef.current?.showModal()
      document.body.classList.add('navds-modal__document-body')
    }
  })

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaMainApi)

  useEffect(() => {
    const handleArrowKeys = (event: KeyboardEvent) => {
      if (modalIsOpen && (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Escape')) {
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
  }, [modalIsOpen, onPrevButtonClick, onNextButtonClick])

  if (images.length === 0) {
    return <CameraIcon width={400} height={300} style={{ background: 'white' }} aria-label="Ingen bilde tilgjengelig" />
  }

  if (modalIsOpen) {
    return (
      <VStack as={'dialog'} className={styles.modalDialog} ref={dialogRef} align={'center'}>
        <Button
          aria-label="Lukk"
          variant="tertiary-neutral"
          onClick={() => setModalIsOpen(false)}
          icon={<XMarkIcon aria-hidden height={30} width={30} />}
          style={{ alignSelf: 'end' }}
        />
        <VStack gap={"space-16"} className={styles.modalContainer}>
          <div className={styles.embla__viewport} ref={emblaMainRef}>
            <div className={styles.embla__container}>
              {images.map((image, index) => (
                <div className={styles.emblaSlide} key={index}>
                  {
                    <Image
                      aria-selected={true}
                      loader={largeImageLoader}
                      src={image.uri}
                      alt={`Produktbilde ${index + 1} av ${images.length}`}
                      fill
                      className={styles.image}
                    />
                  }
                </div>
              ))}
            </div>
          </div>

          {images.length > 1 && (
            <HStack gap={"space-8"} align={'center'} justify={'center'}>
              <Button
                aria-label="Forrige bilde"
                variant="tertiary"
                onClick={onPrevButtonClick}
                icon={<ChevronLeftIcon aria-hidden height={40} width={40} />}
                disabled={prevBtnDisabled}
              />
              <Hide below={'lg'}>
                <div className={styles.emblaThumbs__viewport} ref={emblaThumbsRef}>
                  <HStack wrap={false} gap={"space-8"}>
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
          )}
        </VStack>
      </VStack>
    );
  } else {
    return (
      <>
        <VStack gap={"space-16"} className={styles.embla}>
          <div style={{ position: 'relative' }}>
            <button
              aria-label="Gå til fullskjermmodus"
              onClick={() => setModalIsOpen(true)}
              className={styles.fullscreenButtonKeyboard}
            />
            <div className={styles.embla__viewport} ref={emblaMainRef}>
              <div className={styles.embla__container}>
                {images.map((image, index) => (
                  <div className={styles.emblaSlide} key={index}>
                    {
                      <Image
                        aria-label="Gå til fullskjermmodus"
                        onClick={() => setModalIsOpen(true)}
                        loader={largeImageLoader}
                        src={image.uri}
                        alt={`Produktbilde ${index + 1} av ${images.length}`}
                        fill
                        className={styles.image}
                      />
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>

          {images.length > 1 && (
            <HStack gap={"space-8"} align={'center'} justify={'center'} style={{ position: 'relative', zIndex: '100' }}>
              <Button
                aria-label="Forrige bilde"
                variant="tertiary"
                onClick={onPrevButtonClick}
                icon={<ChevronLeftIcon aria-hidden height={40} width={40} />}
                disabled={prevBtnDisabled}
              />
              <Hide below={'lg'}>
                <div className={styles.emblaThumbs__viewport} ref={emblaThumbsRef}>
                  <HStack wrap={false} gap={"space-8"}>
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
          )}
        </VStack>
      </>
    );
  }
}

export default ImageCarousel
