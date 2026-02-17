import { JSX } from 'react'
import { BevegelseIkon } from '@/app/kategori/ikoner/BevegelseIkon'
import { HygieneIkon } from '@/app/kategori/ikoner/HygieneIkon'
import { HjemOgBoligIkon } from '@/app/kategori/ikoner/HjemOgBoligIkon'
import { SportOgAktivitetIkon } from '@/app/kategori/ikoner/SportOgAktivitetIkon'
import { SynIkon } from '@/app/kategori/ikoner/SynIkon'
import { HørselIkon } from '@/app/kategori/ikoner/HorselIkon'
import { KognisjonIkon } from '@/app/kategori/ikoner/KognisjonIkon'

export type FrontPageCategoryTitles =
  | 'Bevegelse'
  | 'Hygiene'
  | 'Bolig'
  | 'Sport og aktivitet'
  | 'Syn'
  | 'Hørsel'
  | 'Kognisjon'
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
const bolig: TopLevelCategory = {
  title: 'Bolig',
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

const kognisjon: TopLevelCategory = {
  title: 'Kognisjon',
  description: '',
  icon: <KognisjonIkon />,
}

export const topLevelcategories: TopLevelCategories = {
  Bevegelse: bevegelse,
  Hygiene: hygiene,
  Bolig: bolig,
  'Sport og aktivitet': sportOgAktivitet,
  Syn: syn,
  Hørsel: hørsel,
  Alle: alle,
  Kognisjon: kognisjon,
}
export const frontPageCategories: FrontPageCategories = {
  Hørsel: hørsel,
  Syn: syn,
  Bevegelse: bevegelse,
  Bolig: bolig,
  Hygiene: hygiene,
  'Sport og aktivitet': sportOgAktivitet,
  Kognisjon: kognisjon,
}

export const topLevelCategoryTitles: TopLevelCategoryTitles[] = [
  'Bevegelse',
  'Bolig',
  'Hygiene',
  'Sport og aktivitet',
  'Syn',
  'Hørsel',
  'Kognisjon',
  'Alle',
]
export const frontPageTitles: FrontPageCategoryTitles[] = [
  'Bevegelse',
  'Bolig',
  'Hygiene',
  'Sport og aktivitet',
  'Syn',
  'Hørsel',
  'Kognisjon',
]
