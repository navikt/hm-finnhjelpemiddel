import { AgreementsSourceResponse, PostResponse } from './response-types'

export const getPostTitle = (posts: Post[], postNr: number): string | undefined => {
  const prefix = `Post ${postNr}: `
  return posts.find((post) => post.nr === postNr)?.title.substring(prefix.length)
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
