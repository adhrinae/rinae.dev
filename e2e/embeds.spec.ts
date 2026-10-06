import { expect, test } from '@playwright/test'

const YOUTUBE_POST = '/posts/understanding-taming-the-meta-language-kor'
const TWITTER_POST = '/posts/ui-as-an-afterthought-kr'
const GISCUS_ENABLED_POST = '/posts/recreating-blog-2025'
const GISCUS_DISABLED_POST = '/posts/review-when-to-usememo-and-usecallback'

test('the existing YouTube embed renders at its baseline size', async ({ page }) => {
  await page.goto(YOUTUBE_POST)

  const frame = page.locator('iframe[src="https://www.youtube.com/embed/_0T5OSSzxms"]')
  await expect(frame).toBeVisible()

  const box = await frame.boundingBox()
  expect(box).not.toBeNull()
  expect(Math.round(box!.width)).toBe(560)
  expect(Math.round(box!.height)).toBe(315)
})

test('the existing Twitter quote renders as an embed', async ({ page }) => {
  await page.goto(TWITTER_POST)

  await expect(page.locator('script[src*="platform.twitter.com/widgets.js"]')).toHaveCount(1)
  await expect(page.locator('iframe[src*="platform.twitter.com/embed"]').first()).toBeVisible({
    timeout: 30_000,
  })
})

test('Giscus renders only on the comment-enabled article and keeps its baseline configuration', async ({
  page,
}) => {
  await page.goto(GISCUS_ENABLED_POST)

  await expect(page.locator('section#comments.giscus-comments')).toBeVisible()
  await expect(page.locator('#comments .giscus')).toHaveCount(1)

  const embed = page.locator('script[src="https://giscus.app/client.js"]')
  await expect(embed).toHaveCount(1)
  const config = await embed.evaluate((script) => ({
    dataset: { ...script.dataset },
    crossOrigin: script.crossOrigin,
    async: script.async,
  }))
  expect(config.dataset).toMatchObject({
    repo: 'adhrinae/rinae.dev',
    repoId: 'MDEwOlJlcG9zaXRvcnkyNDg2MzYzMjE=',
    category: 'Giscus Comments',
    categoryId: 'DIC_kwDODtHjoc4CejDt',
    mapping: 'pathname',
    strict: '0',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'top',
    theme: 'preferred_color_scheme',
    lang: 'ko',
    loading: 'lazy',
  })
  expect(config.crossOrigin).toBe('anonymous')
  expect(config.async).toBe(true)

  await expect(page.locator('iframe[src*="giscus.app"]').first()).toBeVisible({ timeout: 30_000 })

  await page.goto(GISCUS_DISABLED_POST)
  await expect(page.locator('script[src*="giscus.app"]')).toHaveCount(0)
  await expect(page.locator('section#comments')).toHaveCount(0)
  await expect(page.locator('.giscus')).toHaveCount(0)
})
