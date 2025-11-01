export const SITE = {
  title: 'Read, Think and Code',
  url: 'https://rinae.dev',
  description: 'rinae의 개발 블로그',
  language: 'ko-kr',
}

export const getSiteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || SITE.url
