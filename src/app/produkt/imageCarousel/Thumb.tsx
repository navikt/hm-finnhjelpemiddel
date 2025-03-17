import classNames from 'classnames'
import styles from '@/app/produkt/imageCarousel/ImageCarousel.module.scss'
import Image from 'next/image'
import { smallImageLoader } from '@/utils/image-util'
import React from 'react'

export const Thumb = ({
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
