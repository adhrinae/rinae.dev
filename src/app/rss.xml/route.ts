import { SITE, getSiteUrl } from '@/config/site'
import { getPosts } from '@/lib/get-posts'

export const dynamic = 'force-static'

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export async function GET() {
  const allPosts = await getPosts()
  const siteUrl = getSiteUrl()
  const posts = allPosts
    .map((post) => {
      const title = escapeXml(post.title)
      const description = post.frontMatter.description
        ? escapeXml(post.frontMatter.description)
        : ''
      const link = `${siteUrl}${post.route}`
      const pubDate = new Date(post.frontMatter.date).toUTCString()

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
    <title>${SITE.title}</title>
    <link>${siteUrl}</link>
    <description>${SITE.description}</description>
    <language>${SITE.language}</language>
${posts}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  })
}
