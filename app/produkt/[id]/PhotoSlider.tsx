'use client'
import { useEffect, useState } from 'react'
import { ChevronLeftCircle, ChevronRightCircle, Picture } from '@navikt/ds-icons'
import { Photo } from '../../../utils/product-util'
import { AnimatePresence, motion } from 'framer-motion'

import './slider.scss'

type ImageSliderProps = {
  photos: Photo[]
}

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }
  },
}

const PhotoSlider = ({ photos }: ImageSliderProps) => {
  const numberOfImages = photos.length
  const hasImages = photos.length !== 0
  let [active, setActive] = useState(0)
  let [direction, setDirection] = useState(0)
  let [src, setSrc] = useState(photos[active]?.uri)

  useEffect(() => setSrc(photos[active]?.uri), [active, photos, setSrc])

  const imageLoader = ({ src }: { src: string }) => {
    return `https://www.hjelpemiddeldatabasen.no/blobs/orig/${src}`
  }

  const prevImage = () => {
    const prevIndex = active !== 0 ? active - 1 : numberOfImages - 1
    setActive(prevIndex)
    setDirection(-1)
  }

  const nextImage = () => {
    const nextIndex = active !== numberOfImages - 1 ? active + 1 : 0
    setActive(nextIndex)
    setDirection(1)
  }

  /**
   * Experimenting with distilling swipe offset and velocity into a single variable, so the
   * less distance a user has swiped, the more velocity they need to register as a swipe.
   * Should accomodate longer swipes and short flicks without having binary checks on
   * just distance thresholds and velocity > 0.
   *
   * src: https://codesandbox.io/s/framer-motion-image-gallery-pqvx3?from-embed=&file=/src/Example.tsx:1480-1488
   */
  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  return (
    <div className="photo-slider">
      <div className="photo-and-arrow-container">
        {!hasImages && (
          <Picture width={400} height={300} style={{ background: 'white' }} aria-label="Ingen bilde tilgjengelig" />
        )}
        {numberOfImages === 1 && (
          <>
            <div style={{ width: '40px', height: '40px' }}></div>
            <div className="photo-container">
              <img
                key={src}
                src={imageLoader({ src: src })}
                style={{ objectFit: 'contain' }}
                onError={() => setSrc('/public/assets/midlertidig-manglende-bilde.jpg')}
              />
            </div>
            <div style={{ width: '40px', height: '40px' }}></div>
          </>
        )}

        {numberOfImages > 1 && (
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
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={src}
                  src={imageLoader({ src: src })}
                  custom={direction}
                  variants={variants}
                  initial="enter"
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

                    if (swipe < -swipeConfidenceThreshold) {
                      nextImage()
                    } else if (swipe > swipeConfidenceThreshold) {
                      prevImage()
                    }
                  }}
                  style={{ objectFit: 'contain' }}
                  onError={() => setSrc('/public/assets/midlertidig-manglende-bilde.jpg')}
                />
              </AnimatePresence>
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
