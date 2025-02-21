'use client'

import { Photo } from '@/utils/product-util'
import useEmblaCarousel from 'embla-carousel-react'
import styles from './ImageCarousel.module.scss'
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { largeImageLoader, smallImageLoader } from '@/utils/image-util'

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

  return (
    <section className={styles.embla}>
      <div className={styles.embla__viewport} ref={emblaMainRef}>
        <div className={styles.embla__container}>
          {images.map((image, index) => (
            <div className={styles.embla__slide} key={index}>
              <div className={styles.embla__slide__number}>
                {
                  <Image
                    aria-selected={true}
                    //onClick={() => setActive(i)}
                    loader={largeImageLoader}
                    src={image.uri}
                    alt={`Produktbilde ${index + 1} av ${images.length}`}
                    fill
                    className={styles.image}
                  />
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.emblaThumbs}>
        <div className={styles.emblaThumbs__viewport} ref={emblaThumbsRef}>
          <div className={styles.emblaThumbs__container}>
            {images.map((image, index) => (
              <Thumb
                imageUri={image.uri}
                key={index}
                onClick={() => onThumbClick(index)}
                selected={index === selectedIndex}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
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
    <div className={styles.emblaThumbs__slide}>
      <button onClick={onClick} type="button" className={styles.emblaThumbs__slide__number}>
        <Image
          aria-selected={true}
          //onClick={() => setActive(i)}
          loader={largeImageLoader}
          src={imageUri}
          alt={`Produktbilde ${index + 1}`}
          width={50}
          height={50}
        />
      </button>
    </div>
  )
}

export default ImageCarousel
