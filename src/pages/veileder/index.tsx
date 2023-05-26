import { Category, SituationCategories } from '../../utils/situation-util'
import Image from 'next/image'
import React, { useState } from 'react'
import { Alert, BodyLong, BodyShort, LinkPanel, Heading, Button } from '@navikt/ds-react'

import styles from './index.module.scss'
import AnimateLayout from '../../components/layout/AnimateLayout'

export default function Page() {
  const [openCategory, setOpenCategory] = useState<number | null>(null)
  return (
    <AnimateLayout>
      <div className={styles.veileder}>
        <ul className={styles.grid}>
          {SituationCategories.map((category: Category) => {
            const entryClassName =
              category.id === openCategory ? `${styles.entry} ${styles.entry__selected}` : styles.entry
            return (
              <React.Fragment key={category.id}>
                <li className={entryClassName} key={category.id}>
                  <button
                    className={styles.categoryButton}
                    onClick={() => {
                      const newOpenCategory = openCategory === category.id ? null : category.id
                      setOpenCategory(newOpenCategory)
                    }}
                  >
                    <Image
                      src={category.iconUrl}
                      alt={'Bilde nummer '}
                      width={50}
                      height={50}
                      style={{ objectFit: 'contain' }}
                      priority
                    />
                    <Heading level="1" size="medium">
                      {category.name}
                    </Heading>
                  </button>
                </li>
                {openCategory === category.id && (
                  <li className={styles.fullwidth}>
                    <CategoryOpen category={category}></CategoryOpen>
                  </li>
                )}
              </React.Fragment>
            )
          })}
        </ul>
      </div>
    </AnimateLayout>
  )
}

const CategoryOpen = ({ category }: { category: Category }) => {
  if (category.id === 3) {
    return (
      <div className={styles.category}>
        <Heading level="2" size="medium">
          {category.name}
        </Heading>
        <BodyLong spacing>Rettigheter og muligheter for tilrettelegging der du bor og for fritiden din.</BodyLong>
        <BodyShort>Til tilpasning av boligen finnes blant annet:</BodyShort>
        <ul>
          <li>
            <BodyShort>døråpnere og annen omgivelseskontroll</BodyShort>
          </li>
          <li>
            <BodyShort>ramper og trappeheiser</BodyShort>
          </li>
          <li>
            <BodyShort>toalett med dusj- og tørkefunksjon</BodyShort>
          </li>
          <li>
            <BodyShort>heve- og senkemekanisme til kjøkkeninnredning og bad</BodyShort>
          </li>
        </ul>
        <Alert variant="warning">Lenkene fungerer ikke enda, dette er et forslag om hvordan vi kan ha det</Alert>
        <LinkPanel href={''} border>
          <LinkPanel.Title>Bad</LinkPanel.Title>
          <LinkPanel.Description>Her finner du hjelpemidler til eller for bad</LinkPanel.Description>
        </LinkPanel>
        <LinkPanel href={''} border>
          <LinkPanel.Title>Kjøkken</LinkPanel.Title>
          <LinkPanel.Description>Her finner du hjelpemidler til eller for kjøkken</LinkPanel.Description>
        </LinkPanel>
        <LinkPanel href={''} border>
          <LinkPanel.Title>Inngang eller omgivelser</LinkPanel.Title>
          <LinkPanel.Description>
            Her finner du hjelpemidler som kan brukes i inngangen til boligen eller i oppkjørselsen
          </LinkPanel.Description>
        </LinkPanel>
        <LinkPanel href={''} border>
          <LinkPanel.Title>Trapper og etasje</LinkPanel.Title>
          <LinkPanel.Description>
            Her finner du hjelpemidler til eller for bevegelse mellom etasjer
          </LinkPanel.Description>
        </LinkPanel>
        <LinkPanel href={''} border>
          <LinkPanel.Title>Alle</LinkPanel.Title>
          <LinkPanel.Description>
            Her finner du alle hjelpemidler innenfor tilrettelegging av bolig eller fritid
          </LinkPanel.Description>
        </LinkPanel>
      </div>
    )
  } else {
    return (
      <div className="category">
        {
          'Det er ikke laget veiledning for denne kategorien enda, kun for "Trenger tilrettelegging av bolig eller fritid"'
        }
      </div>
    )
  }
}
