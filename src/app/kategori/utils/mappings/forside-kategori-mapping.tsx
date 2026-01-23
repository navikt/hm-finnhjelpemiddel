import { JSX } from 'react'
import { BevegelseIkon } from '@/app/kategori/ikoner/BevegelseIkon'
import { HygieneIkon } from '@/app/kategori/ikoner/HygieneIkon'
import { HjeomOgBoligIkon } from '@/app/kategori/ikoner/HjeomOgBoligIkon'

export type FrontPageCategoryTitles = 'Bevegelse' | 'Hygiene' | 'Hjem og bolig'
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
  icon: <HjeomOgBoligIkon />,
}

export const topLevelcategories: TopLevelCategories = {
  Bevegelse: bevegelse,
  Hygiene: hygiene,
  'Hjem og bolig': hjemOgBolig,
  Alle: alle,
}
export const frontPageCategories: FrontPageCategories = {
  Bevegelse: bevegelse,
  'Hjem og bolig': hjemOgBolig,
  Hygiene: hygiene,
}

export const topLevelCategoryTitles: TopLevelCategoryTitles[] = ['Bevegelse', 'Hygiene', 'Hjem og bolig', 'Alle']
export const frontPageTitles: FrontPageCategoryTitles[] = ['Bevegelse', 'Hjem og bolig', 'Hygiene']
