'use client'
import { Bilde } from '../../../utils/produkt-util'
import Image from 'next/image'
import { ChevronLeftCircle, ChevronRightCircle } from '@navikt/ds-icons'

import './slider.scss'
import { useState } from 'react'

type BildeSliderProps = {
  bilder: Bilde[]
}

const testBilder: Bilde[] = [
  { url: 'https://picsum.photos/id/2/320/200', order: 0 },
  { url: 'https://picsum.photos/id/133/300/200', order: 1 },
  { url: 'https://picsum.photos/id/21/300/200', order: 2 },
  { url: 'https://picsum.photos/id/23/300', order: 3 },
]

const Bildeslider = ({ bilder }: BildeSliderProps) => {
  const antallBilder = testBilder.length
  let [aktiv, setAktiv] = useState(0)

  const forrigeBilde = () => {
    const forrigeIndex = aktiv !== 0 ? aktiv - 1 : antallBilder - 1
    setAktiv(forrigeIndex)
  }

  const nesteBilde = () => {
    const nesteIndex = aktiv !== antallBilder - 1 ? aktiv + 1 : 0
    setAktiv(nesteIndex)
  }
  // Det er ikke data med flere bilder enda, så venter med å sjule chevron ol før det skjer
  return (
    <div className="bilde-slider">
      <div className="bilde-og-piler">
        <div
          className="pil"
          onClick={() => {
            forrigeBilde()
          }}
        >
          <ChevronLeftCircle height={40} width={40} />
        </div>
        <div className="bilde-container">
          {testBilder.map((bilde: Bilde, i: number) => {
            if (i === aktiv) {
              return (
                <Image
                  key={bilde.url}
                  src={bilde.url}
                  alt={'Bilde nummer ' + String(bilde.order)}
                  width={400}
                  height={300}
                  style={{ objectFit: 'contain' }}
                />
              )
            } else {
              return <></>
            }
          })}
        </div>
        <div
          className="pil"
          onClick={() => {
            nesteBilde()
          }}
        >
          <ChevronRightCircle height={40} width={40} />
        </div>
      </div>
      <div className="dots">
        {[...Array(antallBilder).keys()].map((index) => {
          if (index !== aktiv) {
            return (
              <div
                key={index}
                className={'dot'}
                onClick={() => {
                  setAktiv(index)
                }}
              ></div>
            )
          } else {
            return <div key={index} className="activeDot"></div>
          }
        })}
      </div>
    </div>
  )
}

export default Bildeslider
