type Situations = Category[]

export type Category = {
  id: number
  name: string
  iconUrl: string
}

export const SituationCategoryName: Situations = [
  { id: 1, name: 'Trenger tilrettelegging på jobb eller i utdanning', iconUrl: '/assets/icons/office.svg' },
  {
    id: 2,
    name: 'Trenger tilrettelegging i barnehagen eller på skolen',
    iconUrl: '/assets/icons/schoolbag.svg',
  },
  { id: 3, name: 'Trenger tilrettelegging av bolig eller fritid', iconUrl: '/assets/icons/home.svg' },
  { id: 4, name: 'Har nedsatt hørsel', iconUrl: '/assets/icons/hearing.svg' },
  { id: 5, name: 'Har nedsatt syn', iconUrl: '/assets/icons/sight.svg' },
  { id: 6, name: 'Har vansker med tale og språk', iconUrl: '/assets/icons/dialog.svg' },
  { id: 7, name: 'Har vansker med å huske, planlegge og organisere', iconUrl: '/assets/icons/calender.svg' },
  { id: 8, name: 'Har vansker med bevegelse og forflytning', iconUrl: '/assets/icons/disability.svg' },
  { id: 9, name: 'Har lese- og skrivevansker', iconUrl: '/assets/icons/write.svg' },
  {
    id: 10,
    name: 'Trenge protese, ortose, ortopediske sko eller parykk',
    iconUrl: '/assets/icons/square.svg',
  },
]

export const SituationCategoryIsoCodes = {
  1: ['18', '18090301'],
  2: [],
  3: ['15', '180312', '180315', '180915'],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
  10: [],
}
