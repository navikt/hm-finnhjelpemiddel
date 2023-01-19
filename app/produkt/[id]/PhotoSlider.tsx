'use client'
import { useEffect, useState } from 'react'
import { ChevronLeftCircle, ChevronRightCircle, Picture } from '@navikt/ds-icons'
import Image from 'next/image'
import { Photo } from '../../../utils/product-util'

import './slider.scss'

type ImageSliderProps = {
  photos: Photo[]
}

const PhotoSlider = ({ photos }: ImageSliderProps) => {
  const numberOfImages = photos.length
  const hasImages = photos.length !== 0
  let [active, setActive] = useState(0)
  let [src, setSrc] = useState(photos[active]?.uri)

  useEffect(() => setSrc(photos[active]?.uri), [active, photos, setSrc])

  const imageLoader = ({ src }: { src: string }) => {
    return `https://www.hjelpemiddeldatabasen.no/blobs/orig/${src}`
  }

  const prevImage = () => {
    const prevIndex = active !== 0 ? active - 1 : numberOfImages - 1
    setActive(prevIndex)
  }

  const nextImage = () => {
    const nextIndex = active !== numberOfImages - 1 ? active + 1 : 0
    setActive(nextIndex)
  }

  return (
    <div className="photo-slider">
      <div className="photo-and-arrow-container">
        {!hasImages && (
          <Picture width={400} height={300} style={{ background: 'white' }} aria-label="Ingen bilde tilgjengelig" />
        )}
        {hasImages && (
          <>
            <div
              className="arrow"
              onClick={() => {
                prevImage()
              }}
            >
              <ChevronLeftCircle height={40} width={40} />
            </div>
            <div className="photo-container">
              <Image
                loader={imageLoader}
                src={src}
                alt={'Bilde nummer ' + (active + 1)}
                width={400}
                height={300}
                style={{ objectFit: 'contain' }}
                onError={() => setSrc('/public/assets/midlertidig-manglende-bilde.jpg')}
              />
            </div>
            <div
              className="arrow"
              onClick={() => {
                nextImage()
              }}
            >
              <ChevronRightCircle height={40} width={40} />
            </div>
          </>
        )}
      </div>
      <div className="dots">
        {[...Array(numberOfImages).keys()].map((index) => {
          if (index !== active) {
            return (
              <div
                key={index}
                className={'dot'}
                onClick={() => {
                  setActive(index)
                }}
              />
            )
          } else {
            return <div key={index} className="activeDot" />
          }
        })}
      </div>
    </div>
  )
}

export default PhotoSlider
