'use client'

import { Photo } from '@/utils/product-util'
import useEmblaCarousel from 'embla-carousel-react'
import styles from './ImageCarousel.module.scss'
import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { largeImageLoader, smallImageLoader } from '@/utils/image-util'
import { BodyShort, Button, Hide, HStack, VStack } from '@navikt/ds-react'
import { EmblaCarouselType } from 'embla-carousel'
import classNames from 'classnames'
import { CameraIcon, ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons'

const ImageCarousel = ({ images }: { images: Photo[] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({})
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  })

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

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaMainApi)

  if (images.length === 0) {
    return <CameraIcon width={400} height={300} style={{ background: 'white' }} aria-label="Ingen bilde tilgjengelig" />
  }

  return (
    <VStack gap={'4'} className={styles.embla}>
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
            className="arrow"
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
            className="arrow"
            onClick={onNextButtonClick}
            icon={<ChevronRightIcon aria-hidden height={40} width={40} />}
            disabled={nextBtnDisabled}
          />
        </HStack>
      )}
    </VStack>
  )
}

const Thumb = ({
  selected,
  index,
  imageUri,
  onClick,
}: {
  selected: boolean
  index: number
  imageUri: string
  onClick: () => void
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={classNames(styles.emblaThumbs__slide__number, { [styles.emblaThumbs__slideSelected]: selected })}
    >
      <div className={styles.thumbImageWrapper}>
        <Image
          aria-selected={true}
          loader={smallImageLoader}
          src={imageUri}
          alt={`Produktbilde ${index + 1}`}
          fill
          className={styles.thumbImage}
        />
      </div>
    </button>
  )
}

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean
  nextBtnDisabled: boolean
  onPrevButtonClick: () => void
  onNextButtonClick: () => void
}

export const usePrevNextButtons = (emblaApi: EmblaCarouselType | undefined): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
  }, [emblaApi])

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect).on('select', onSelect)
  }, [emblaApi, onSelect])

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  }
}

export default ImageCarousel
