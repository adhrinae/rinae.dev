export interface TaggablePost {
  data: {
    title: string
    tags: readonly string[]
  }
}

export interface ReadingTag {
  name: string
  count: number
}

export const getReadingTags = <T extends TaggablePost>(posts: readonly T[]): ReadingTag[] => {
  const counts = new Map<string, number>()

  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }

  return [...counts].map(([name, count]) => ({ name, count }))
}

export const getPostsForTag = <T extends TaggablePost>(posts: readonly T[], tag: string): T[] =>
  posts.filter((post) => post.data.tags.includes(tag))

export const getRelatedPosts = <T extends TaggablePost>(posts: readonly T[], post: T): T[] => {
  const tags = new Set(post.data.tags)
  if (tags.size === 0) return []

  return posts
    .filter(
      (candidate) =>
        candidate.data.title !== post.data.title && candidate.data.tags.some((tag) => tags.has(tag))
    )
    .slice(0, 5)
}

export const getTagUrl = (tag: string): string => `/tags/${encodeURIComponent(tag)}`
