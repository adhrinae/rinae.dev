import { getCollection, type CollectionEntry } from 'astro:content'

type ReadingPost = CollectionEntry<'post'>
type MarkdownFixture = CollectionEntry<'markdownFixture'>
type RoutedEntry = {
  entry: ReadingPost | MarkdownFixture
  basePath: '/posts' | '/preview'
}

const reservedPaths = new Set(['/', '/posts', '/preview'])

const normalizePublicPath = (path: string): string => {
  const segments: string[] = []

  for (const segment of path.split('/')) {
    if (!segment || segment === '.') continue
    if (segment === '..') {
      segments.pop()
      continue
    }
    segments.push(segment)
  }

  return `/${segments.join('/')}`
}

const publicPathFor = ({ entry, basePath }: RoutedEntry): string => {
  const slug = entry.data.slug || entry.id
  const source = entry.filePath || entry.id
  const candidate = `${basePath}/${slug}`
  const normalized = normalizePublicPath(candidate)

  if (reservedPaths.has(normalized)) {
    throw new Error(
      `[reading] Reserved public path collision at ${normalized}: ${source} uses slug "${slug}"`
    )
  }

  if (!normalized.startsWith(`${basePath}/`)) {
    throw new Error(
      `[reading] Public path collision escapes ${basePath} at ${normalized}: ${source} uses slug "${slug}"`
    )
  }

  if (normalized !== candidate || /[?#\\]/.test(slug)) {
    throw new Error(
      `[reading] Invalid public path in ${source}: slug "${slug}" does not form a canonical URL under ${basePath}`
    )
  }

  return normalized
}

const validatePublicPaths = (routedEntries: RoutedEntry[]): void => {
  const sourcesByPath = new Map<string, string>()

  for (const routedEntry of routedEntries) {
    const publicPath = publicPathFor(routedEntry)
    const source = routedEntry.entry.filePath || routedEntry.entry.id
    const previousSource = sourcesByPath.get(publicPath)

    if (previousSource) {
      throw new Error(
        `[reading] Public path collision at ${publicPath}: ${previousSource} and ${source}`
      )
    }

    sourcesByPath.set(publicPath, source)
  }
}

export const getValidatedReadingCollections = async () => {
  const [posts, markdownFixtures] = await Promise.all([
    getCollection('post'),
    getCollection('markdownFixture'),
  ])

  validatePublicPaths([
    ...posts.map((entry) => ({ entry, basePath: '/posts' as const })),
    ...markdownFixtures.map((entry) => ({ entry, basePath: '/preview' as const })),
  ])

  return { posts, markdownFixtures }
}
