import type { CollectionEntry } from 'astro:content'
import { getValidatedReadingCollections } from './content-routes'

export type ReadingPost = CollectionEntry<'post'>

export const getReadingPosts = async (): Promise<ReadingPost[]> => {
  const { posts } = await getValidatedReadingCollections()
  return posts.sort(
    (left, right) =>
      Date.parse(right.data.date) - Date.parse(left.data.date) || left.id.localeCompare(right.id)
  )
}

export const getPostUrl = (post: ReadingPost): string => `/posts/${post.data.slug || post.id}`

export const formatPostDate = (date: string): string =>
  new Date(`${date}T00:00:00.000Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
