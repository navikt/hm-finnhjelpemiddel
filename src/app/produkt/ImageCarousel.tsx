'use client'

import { Photo } from '@/utils/product-util'
import useEmblaCarousel from 'embla-carousel-react'
import styles from './ImageCarousel.module.scss'
import React, { ComponentPropsWithRef, useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { largeImageLoader, smallImageLoader } from '@/utils/image-util'
import { HGrid, HStack, VStack } from '@navikt/ds-react'
import { EmblaCarouselType } from 'embla-carousel'
import classNames from 'classnames'

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
      <HGrid columns={'1fr 9fr 1fr'}>
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
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
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </HGrid>
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
          //onClick={() => setActive(i)}
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

type PropType = ComponentPropsWithRef<'button'>

export const PrevButton: React.FC<PropType> = (props) => {
  const { children, ...restProps } = props

  return (
    <button className={styles.embla__button} type="button" {...restProps}>
      <svg className={styles.embla__button__svg} viewBox="0 0 532 532">
        <path
          fill="currentColor"
          d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
        />
      </svg>
      {children}
    </button>
  )
}

export const NextButton: React.FC<PropType> = (props) => {
  const { children, ...restProps } = props

  return (
    <button className={styles.embla__button} type="button" {...restProps}>
      <svg className={styles.embla__button__svg} viewBox="0 0 532 532">
        <path
          fill="currentColor"
          d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"
        />
      </svg>
      {children}
    </button>
  )
}

export default ImageCarousel
