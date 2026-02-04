import { JSX } from 'react'
import { BevegelseIkon } from '@/app/kategori/ikoner/BevegelseIkon'
import { HygieneIkon } from '@/app/kategori/ikoner/HygieneIkon'
import { HjemOgBoligIkon } from '@/app/kategori/ikoner/HjemOgBoligIkon'
import { SportOgAktivitetIkon } from '@/app/kategori/ikoner/SportOgAktivitetIkon'
import { SynIkon } from '@/app/kategori/ikoner/SynIkon'
import { HørselIkon } from '@/app/kategori/ikoner/HorselIkon'

export type FrontPageCategoryTitles =
  | 'Bevegelse'
  | 'Hygiene'
  | 'Hjem og bolig'
  | 'Sport og aktivitet'
  | 'Syn'
  | 'Hørsel'
export type TopLevelCategoryTitles = FrontPageCategoryTitles | 'Alle'

type TopLevelCategories = {
  [key in TopLevelCategoryTitles]: TopLevelCategory
}
type FrontPageCategories = {
  [key in FrontPageCategoryTitles]: TopLevelCategory
}

type TopLevelCategory = {
  title: TopLevelCategoryTitles
  description: string
  icon?: JSX.Element | undefined
}

const alle: TopLevelCategory = {
  title: 'Alle',
  description: 'Se alle hjelpemidler på søkesiden',
}
const bevegelse: TopLevelCategory = {
  title: 'Bevegelse',
  description: '',
  icon: <BevegelseIkon />,
}
const hygiene: TopLevelCategory = {
  title: 'Hygiene',
  description: '',
  icon: <HygieneIkon />,
}
const hjemOgBolig: TopLevelCategory = {
  title: 'Hjem og bolig',
  description: '',
  icon: <HjemOgBoligIkon />,
}

const sportOgAktivitet: TopLevelCategory = {
  title: 'Sport og aktivitet',
  description: '',
  icon: <SportOgAktivitetIkon />,
}
const syn: TopLevelCategory = {
  title: 'Syn',
  description: '',
  icon: <SynIkon />,
}
const hørsel: TopLevelCategory = {
  title: 'Hørsel',
  description: '',
  icon: <HørselIkon />,
}

export const topLevelcategories: TopLevelCategories = {
  Bevegelse: bevegelse,
  Hygiene: hygiene,
  'Hjem og bolig': hjemOgBolig,
  'Sport og aktivitet': sportOgAktivitet,
  Syn: syn,
  Hørsel: hørsel,
  Alle: alle,
}
export const frontPageCategories: FrontPageCategories = {
  Hørsel: hørsel,
  Syn: syn,
  Bevegelse: bevegelse,
  'Hjem og bolig': hjemOgBolig,
  Hygiene: hygiene,
  'Sport og aktivitet': sportOgAktivitet,
}

export const topLevelCategoryTitles: TopLevelCategoryTitles[] = [
  'Bevegelse',
  'Hygiene',
  'Hjem og bolig',
  'Sport og aktivitet',
  'Alle',
]
export const frontPageTitles: FrontPageCategoryTitles[] = [
  'Bevegelse',
  'Hjem og bolig',
  'Hygiene',
  'Sport og aktivitet',
  'Syn',
  'Hørsel',
]
