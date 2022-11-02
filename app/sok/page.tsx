'use client'
import { BodyShort, Search, Select, Heading } from '@navikt/ds-react'
import { NextPage } from 'next/types'
import { useState } from 'react'
import { calculateNextAvailableIsoCategory } from '../../utils/isoCategory'
import Produkt from './Produkt'

const SokPage: NextPage<{}> = () => {
  const [selectedIsocode, setSelectedIsocode] = useState<string>('')
  const filtrerteArtikler = [1, 2, 3]
  const levels = selectedIsocode.length / 2 + 1

  return (
    <div className="flex-wrapper">
      <div className="search__side-bar">
        <form>
          <Heading level="2" size="medium">
            Søk
          </Heading>
          <Search label="Søk artikler" variant="primary" role="search" size="small" className="search__input-field" />
          {[...Array(levels).keys()].map((i) => {
            const nextCategories = calculateNextAvailableIsoCategory(selectedIsocode, i)
            return (
              nextCategories.length > 0 && (
                <Select label={'Velg kategori ' + (i + 1)} onChange={(e) => setSelectedIsocode(e.target.value)} key={i}>
                  <option value="">Velg kategori</option>
                  {nextCategories.map(([isoCode, title]) => (
                    <option key={isoCode} value={isoCode}>
                      {title}
                    </option>
                  ))}
                </Select>
              )
            )
          })}
        </form>
      </div>
      <div className="results__wrapper">
        <header className="results__header">
          <div>
            <Heading level="2" size="medium">
              Søkeresultat
            </Heading>
            <BodyShort>x av y antall produkter vises</BodyShort>
          </div>
          <Select label="Sortér etter" hideLabel={false} className="results__sort-select" size="small">
            <option value="">Alfabetisk</option>
          </Select>
        </header>
        <ol className="results__list">
          {filtrerteArtikler.map((i) => (
            <Produkt key={i} artikkelId={'artikkel'} artikkelnavn={'artikkelnavn'} paaRammeavtale={false}></Produkt>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default SokPage
