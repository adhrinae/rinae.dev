export const SITE = {
  htmlTitle: 'rinae.dev',
  name: 'Read, Think and Code',
  url: 'https://rinae.dev',
  description: 'rinae의 개발 블로그',
  language: 'ko-kr',
} as const

/**
 * Production origin used by feed, sitemap and robots outputs.
 *
 * These are published contracts consumed by RSS readers and search engines, so
 * they must keep the production origin even when the site is built for a
 * preview deployment. Do not derive them from the build environment or request
 * host.
 */
export const getSiteUrl = (): string => SITE.url

export const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export const toRfc822Date = (date: string): string =>
  new Date(`${date}T00:00:00.000Z`).toUTCString()
