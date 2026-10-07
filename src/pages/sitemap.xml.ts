import type { APIRoute } from 'astro'
import { getPostUrl, getReadingPosts } from '../lib/reading-posts'
import { getSiteUrl } from '../lib/site'

interface SitemapEntry {
  url: string
  priority: string
}

const entryXml = ({ url, priority }: SitemapEntry, lastModified: string): string => `<url>
<loc>${url}</loc>
<lastmod>${lastModified}</lastmod>
<changefreq>weekly</changefreq>
<priority>${priority}</priority>
</url>`

export const GET: APIRoute = async () => {
  const siteUrl = getSiteUrl()
  const lastModified = new Date().toISOString()
  const posts = await getReadingPosts()

  const postEntries: SitemapEntry[] = posts
    .map((post) => `${siteUrl}${getPostUrl(post)}`)
    .sort()
    .map((url) => ({ url, priority: '0.8' }))

  const entries: SitemapEntry[] = [
    { url: `${siteUrl}/`, priority: '1' },
    { url: `${siteUrl}/posts`, priority: '0.8' },
    ...postEntries,
    { url: `${siteUrl}/colophon`, priority: '0.8' },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((entry) => entryXml(entry, lastModified)).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
