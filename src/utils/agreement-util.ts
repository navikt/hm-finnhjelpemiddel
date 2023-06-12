import { Filter } from '@/utils/api-util'

import { AgreementsSourceResponse, PostResponse } from './response-types'

export function getPostTitle(post: string, postNr: number): string
export function getPostTitle(posts: Post[], postNr: number): string | undefined
export function getPostTitle(post: unknown, postNr: number): string | undefined {
  const prefix = `Post ${postNr}: `
  if (typeof post === 'string') {
    return post.substring(prefix.length)
  } else if (Array.isArray(post)) {
    return post.find((post) => post.nr === postNr)?.title.substring(prefix.length)
  }
  throw new Error('Could not get postTitle')
}

export interface Agreement {
  id: string
  identifier: string
  title: string
  posts: Post[]
}

export interface Post {
  identifier: string
  nr: number
  title: string
  description: string
}

export const mapAgreement = (source: AgreementsSourceResponse): Agreement => {
  return {
    id: source.id,
    identifier: source.identifier,
    title: source.title,
    posts: mapPosts(source.posts),
  }
}

const mapPosts = (posts: PostResponse[]): Post[] => {
  return posts.map((post: PostResponse) => ({
    identifier: post.identifier,
    nr: post.nr,
    title: post.title,
    description: post.description,
  }))
}

const agreementTitles = [
  {
    identifier: 'HMDB-6427',
    title: 'Kalendere og planleggingssystemer',
  },
  {
    identifier: 'HMDB-7490',
    title: 'Varmehjelpemidler',
  },
  {
    identifier: 'HMDB-8692',
    title: 'TEST UU',
  },
  {
    identifier: 'HMDB-8590',
    title: 'Senger, madrasser, hjertebrett, sengebord og hjelpemidler for overflytting og vending',
  },
  {
    identifier: 'HMDB-8615',
    title: 'Elektrisk hev- og senkfunksjon til innredning på kjøkken og bad',
  },
  {
    identifier: 'HMDB-7449',
    title: 'Elektriske rullestoler ',
  },
  {
    identifier: 'HMDB-8582',
    title: 'Omgivelseskontroll',
  },
  {
    identifier: 'HMDB-8594',
    title: 'Ganghjelpemidler',
  },
  {
    identifier: 'HMDB-8570',
    title: 'Høreapparater, ørepropper og tinnitusmaskerere ',
  },
  {
    identifier: 'HMDB-8601',
    title:
      'Sykler med og uten hjelpemotor, sykkelfronter med hjelpemotor, støttehjul til tohjulssykkel og sykler for personer med nedsatt funksjon i overkroppen',
  },
  {
    identifier: 'HMDB-8607',
    title: 'Arbeidsstoler, arbeidsbord, trillebord og spesielle sittemøbler',
  },
  {
    identifier: 'HMDB-8612',
    title: 'Vogner og hjelpemidler til sport og aktivitet',
  },
  {
    identifier: 'HMDB-8617',
    title: 'Manuelle rullestoler, drivhjul  med elektrisk motor og drivaggregat',
  },
  {
    identifier: 'HMDB-8628',
    title: 'Madrasser med trykksårforebyggende egenskaper',
  },
  {
    identifier: 'HMDB-8639',
    title: 'Løfteplattformer og hjelpemidler til trapp',
  },
  {
    identifier: 'HMDB-8641',
    title: 'Varslingshjelpemidler',
  },
  {
    identifier: 'HMDB-8645',
    title: 'Kommunikasjonshjelpemidler',
  },
  {
    identifier: 'HMDB-8646',
    title: 'Kjøreposer, varmeposer og regncape',
  },
  {
    identifier: 'HMDB-8648',
    title: 'Ståstativ og arm-, kropps- og bentreningshjelpemidler',
  },
  {
    identifier: 'HMDB-8654',
    title: 'Hørselshjelpemidler',
  },
  {
    identifier: 'HMDB-8660',
    title: 'Synstekniske hjelpemidler',
  },
  {
    identifier: 'HMDB-8669',
    title: 'Hjelpemidler for seksuallivet',
  },
  {
    identifier: 'HMDB-8672',
    title: 'Overflyttingsplattformer og personløftere',
  },
  {
    identifier: 'HMDB-8673',
    title: 'Biler',
  },
  {
    identifier: 'HMDB-8679',
    title: 'Moduloppbygde sittesystemer',
  },
  {
    identifier: 'HMDB-8682',
    title: 'Førerhunder og servicehunder ',
  },
  {
    identifier: 'HMDB-8683',
    title: 'Kjøreramper',
  },
  {
    identifier: 'HMDB-8685',
    title: 'Bilombygg',
  },
  {
    identifier: 'HMDB-8686',
    title: 'Hygienehjelpemidler og støttestang',
  },
  {
    identifier: 'HMDB-8688',
    title: 'Stoler med oppreisingsfunksjon',
  },
  {
    identifier: 'HMDB-8709',
    title: 'Sitteputer med trykksårforebyggende egenskaper',
  },
  {
    identifier: 'HMDB-8710',
    title: 'Elektriske rullestoler ',
  },
  {
    identifier: 'HMDB-8712',
    title: 'Kalendere, dagsplanleggere og tidtakere',
  },
  {
    identifier: 'HMDB-8713',
    title: 'Varmehjelpemidler for hender og føtter',
  },
  {
    identifier: 'HMDB-8716',
    title: 'Elektrisk hev- og senkfunksjon til innredning på kjøkken og bad ',
  },
  {
    identifier: 'HMDB-8725',
    title: 'Senger, sengebunner, madrasser, hjertebrett og sengebord ',
  },
  {
    identifier: 'HMDB-8726',
    title: 'Hjelpemidler for overflytting, vending og posisjonering',
  },
  {
    identifier: 'HMDB-8734',
    title: 'A Høreapparater, ørepropper og tinnitusmaskerere',
  },
]

export const mapAgreementTitle = (filter?: Filter) =>
  filter && {
    ...filter,
    values: filter?.values.map((f) => ({
      ...f,
      label: agreementTitles.find((agreement) => agreement.identifier === f.key)?.title,
    })),
  }
