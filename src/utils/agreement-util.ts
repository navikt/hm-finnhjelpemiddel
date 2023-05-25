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
