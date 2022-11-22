import { Bilde } from '../../../utils/interface'
import Image from 'next/image'
import { ChevronLeftCircle, ChevronRightCircle } from '@navikt/ds-icons'

import './slider.scss'

type BildeSliderProps = {
  bilder: Bilde[]
}

const BildeSlider = ({ bilder }: BildeSliderProps) => {
  const antallBilder = bilder.length
  let aktiv = 0

  const setAktiv = (aktiv: number) => {
    aktiv = aktiv
  }

  const forrigeBilde = () => {
    const forrigeIndex = aktiv !== 0 ? aktiv - 1 : antallBilder - 1
    setAktiv(forrigeIndex)
  }

  const nesteBilde = () => {
    const nesteIndex = aktiv !== antallBilder - 1 ? aktiv + 1 : 0
    setAktiv(nesteIndex)
  }

  return (
    <div className="bilde-slider">
      <div className="bilde-og-piler">
        <div className="pil">
          <ChevronLeftCircle height={40} width={40}></ChevronLeftCircle>
        </div>
        <div className="bilde-container">
          {bilder.map((bilde: Bilde, i: number) => {
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
        <div className="pil">
          <ChevronRightCircle height={40} width={40}></ChevronRightCircle>
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
            return <div key={index} className="dot"></div>
          }
        })}
      </div>
    </div>
  )
}

export default BildeSlider
