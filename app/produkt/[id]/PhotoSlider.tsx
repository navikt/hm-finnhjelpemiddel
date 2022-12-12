'use client'
import { Photo } from '../../../utils/produkt-util'
import { ChevronLeftCircle, ChevronRightCircle } from '@navikt/ds-icons'
import { useState } from 'react'
import Image from 'next/image'
import './slider.scss'

type ImageSliderProps = {
  photos: Photo[]
}

const PhotoSlider = ({ photos }: ImageSliderProps) => {
  const numberOfImages = photos.length
  let [active, setActive] = useState(0)
  let [src, setSrc] = useState(
    numberOfImages == 0
      ? '/assets/midlertidig-manglende-bilde.jpg'
      : `https://www.hjelpemiddeldatabasen.no/blobs/orig/${photos[active].uri}`
  )

  const prevImage = () => {
    const prevIndex = active !== 0 ? active - 1 : numberOfImages - 1
    setActive(prevIndex)
  }

  const nextImage = () => {
    const nextIndex = active !== numberOfImages - 1 ? active + 1 : 0
    setActive(nextIndex)
  }

  // Det er ikke data med flere bilder enda, så venter med å sjule chevron ol før det skjer
  return (
    <div className="photo-slider">
      <div className="photo-and-arrow-container">
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
            src={src}
            alt={'Bilde nummer ' + (active + 1)}
            width={400}
            height={300}
            style={{ objectFit: 'contain' }}
            onError={() => setSrc('/public/assets/midlertidig-manglende-bilde.jpg')}
            priority
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
