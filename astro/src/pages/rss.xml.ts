import type { APIRoute } from 'astro'
import { getPostUrl, getReadingPosts } from '../lib/reading-posts'
import { SITE, escapeXml, getSiteUrl, toRfc822Date } from '../lib/site'

export const GET: APIRoute = async () => {
  const siteUrl = getSiteUrl()
  const posts = await getReadingPosts()

  const items = posts
    .map((post) => {
      const title = escapeXml(post.data.title)
      const description = post.data.description ? escapeXml(post.data.description) : ''
      const link = `${siteUrl}${getPostUrl(post)}`
      const pubDate = toRfc822Date(post.data.date)

      return `    <item>
        <title>${title}</title>
        <description>${description}</description>
        <link>${link}</link>
        <guid isPermaLink="true">${link}</guid>
        <pubDate>${pubDate}</pubDate>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${SITE.name}</title>
    <link>${siteUrl}</link>
    <description>${SITE.description}</description>
    <language>${SITE.language}</language>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  })
}
