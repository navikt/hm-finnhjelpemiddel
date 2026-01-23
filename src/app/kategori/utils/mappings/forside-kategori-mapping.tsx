import { JSX } from 'react'
import { BevegelseIkon } from '@/app/kategori/ikoner/BevegelseIkon'

export type FrontPageCategoryTitles = 'Bevegelse'
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

export const topLevelcategories: TopLevelCategories = {
  Bevegelse: bevegelse,
  Alle: alle,
}
export const frontPageCategories: FrontPageCategories = {
  Bevegelse: bevegelse,
}

export const topLevelCategoryTitles: TopLevelCategoryTitles[] = ['Bevegelse', 'Alle']
export const frontPageTitles: FrontPageCategoryTitles[] = ['Bevegelse']
