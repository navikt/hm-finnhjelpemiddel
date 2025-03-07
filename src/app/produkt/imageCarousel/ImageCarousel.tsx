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

  if (images.length === 0) {
    return <CameraIcon width={400} height={300} style={{ background: 'white' }} aria-label="Ingen bilde tilgjengelig" />
  }

  if (modalIsOpen) {
    return (
      <VStack as={'dialog'} className={styles.modalDialog} ref={dialogRef}>
        <Button
          aria-label="Lukk"
          variant="tertiary-neutral"
          onClick={() => setModalIsOpen(false)}
          icon={<XMarkIcon aria-hidden height={30} width={30} />}
          style={{ alignSelf: 'end' }}
        />
        <VStack gap={'4'} className={styles.modalContainer}>
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
            <HStack gap={'2'} align={'center'} justify={'center'}>
              <Button
                aria-label="Forrige bilde"
                variant="tertiary"
                onClick={onPrevButtonClick}
                icon={<ChevronLeftIcon aria-hidden height={40} width={40} />}
                disabled={prevBtnDisabled}
              />
              <Hide below={'md'}>
                <div className={styles.emblaThumbs__viewport} ref={emblaThumbsRef}>
                  <HStack wrap={false} gap={'2'}>
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
              <Hide above={'md'}>
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
    )
  } else {
    return (
      <>
        <VStack gap={'4'} className={styles.embla}>
          <div className={styles.embla__viewport} ref={emblaMainRef}>
            <div className={styles.embla__container}>
              {images.map((image, index) => (
                <div className={styles.emblaSlide} key={index}>
                  {
                    <Image
                      role="button"
                      onClick={() => setModalIsOpen(true)}
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
            <HStack gap={'2'} align={'center'} justify={'center'}>
              <Button
                aria-label="Forrige bilde"
                variant="tertiary"
                onClick={onPrevButtonClick}
                icon={<ChevronLeftIcon aria-hidden height={40} width={40} />}
                disabled={prevBtnDisabled}
              />
              <Hide below={'md'}>
                <div className={styles.emblaThumbs__viewport} ref={emblaThumbsRef}>
                  <HStack wrap={false} gap={'2'}>
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
              <Hide above={'md'}>
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
    )
  }
}

export default ImageCarousel
