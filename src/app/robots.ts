import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/config/site'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl()
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
