import { expect, test } from '@playwright/test'

import { REPRESENTATIVE_ROUTES } from './support/routes'

// Ticket 04 approved one existing, non-blocking mobile overflow: the fixed 560px YouTube
// embed on this article widens a 390px viewport to 576px. The spec pins that exception
// instead of failing or silently ignoring it.
const APPROVED_MOBILE_OVERFLOW_ROUTE = '/posts/understanding-taming-the-meta-language-kor'

test.use({ viewport: { width: 390, height: 844 } })

for (const route of REPRESENTATIVE_ROUTES) {
  test(`stays within the 390px viewport: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'load' })
    // Let deferred local assets and embeds settle before measuring the layout.
    await page.waitForTimeout(2000)

    const metrics = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      widestIframe: [...document.querySelectorAll('iframe')].reduce(
        (widest, frame) => Math.max(widest, frame.getBoundingClientRect().width),
        0
      ),
    }))

    if (route !== APPROVED_MOBILE_OVERFLOW_ROUTE) {
      expect(metrics.documentWidth, `${route} must not overflow at 390px`).toBeLessThanOrEqual(
        metrics.viewportWidth
      )
      return
    }

    expect(
      metrics.documentWidth,
      `${route} must carry the approved YouTube overflow`
    ).toBeGreaterThan(metrics.viewportWidth)
    expect(
      Math.round(metrics.widestIframe),
      `${route} overflow must come from the 560px embed`
    ).toBe(560)

    await page
      .locator('iframe')
      .first()
      .evaluate((frame) => {
        frame.style.display = 'none'
      })
    const withoutEmbed = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(withoutEmbed, `${route} must not overflow once the embed is hidden`).toBeLessThanOrEqual(
      390
    )
  })
}
