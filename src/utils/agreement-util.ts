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

export const agreementKeyLabels: Record<string, string> = {
  'HMDB-8617': 'Manuelle rullestoler',
  'HMDB-8710': 'Elektriske rullestoler',
  'HMDB-8686': 'Hygienehjelpemidler og støttestang',
  'HMDB-8709': 'Sitteputer',
  'HMDB-8607': 'Stoler og bord',
  'HMDB-8594': 'Ganghjelpemidler',
  'HMDB-8725': 'Senger',
  'HMDB-8688': 'Stoler med oppreisingsfunksjon',
  'HMDB-8712': 'Kalendere',
  'HMDB-8601': 'Sykler',
  'HMDB-8726': 'Overflytting, vending og posisjonering',
  'HMDB-8716': 'Innredning kjøkken og bad',
  'HMDB-8582': 'Omgivelseskontroll',
  'HMDB-8612': 'Vogner og aktivitetshjelpemidler',
  'HMDB-8734': 'Høreapparater',
  'HMDB-8628': 'Madrasser',
  'HMDB-8639': 'Hjelpemidler til trapp',
  'HMDB-8641': 'Varsling',
  'HMDB-8645': 'Kommunikasjon',
  'HMDB-8646': 'Kjøreposer, varmeposer og regncape',
  'HMDB-8648': 'Ståstativ og treningshjelpemidler',
  'HMDB-8654': 'Hørsel',
  'HMDB-8660': 'Syn',
  'HMDB-8672': 'Plattformer og personløftere',
  'HMDB-8713': 'Varmehjelpemidler',
  'HMDB-8673': 'Biler',
  'HMDB-8679': 'Sittesystem',
  'HMDB-8682': 'Førerhunder og servicehunder',
  'HMDB-8683': 'Kjøreramper',
  'HMDB-8685': 'Bilombygg',
  'HMDB-8669': 'Seksuallivet',
  'HMDB-7449': 'Elektriske rullestoler (duplicate)',
  'HMDB-8692': 'TEST UU',
  'HMDB-8570': 'Høreapparater (duplicate)',
  'HMDB-8615': 'Innredning kjøkken og bad (duplicate)',
  'HMDB-6427': 'Kalendere (duplicate)',
  'HMDB-8590': 'Senger (duplicate)',
  'HMDB-7490': 'Varmehjelpemidler (duplicate)',
}
