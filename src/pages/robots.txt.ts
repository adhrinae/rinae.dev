import type { APIRoute } from 'astro'
import { getSiteUrl } from '../lib/site'

export const GET: APIRoute = () => {
  const body = `User-Agent: *
Allow: /
Disallow: /private/

Sitemap: ${getSiteUrl()}/sitemap.xml
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
