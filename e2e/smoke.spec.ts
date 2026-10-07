import { expect, test } from '@playwright/test'

import { watchNetworkHealth } from './support/blocked-hosts'
import { REPRESENTATIVE_ROUTES } from './support/routes'

for (const route of REPRESENTATIVE_ROUTES) {
  test(`serves ${route} with a working theme, local assets, and only approved host failures`, async ({
    page,
  }) => {
    const health = watchNetworkHealth(page)

    const response = await page.goto(route, { waitUntil: 'load' })
    expect(response?.status(), `${route} must respond 200`).toBe(200)
    await expect(page).toHaveTitle(/\S/)
    await expect(page.locator('header.custom-header')).toBeVisible()
    await expect(page.locator('html')).toHaveClass(/\b(light|dark)\b/)

    if (route !== '/') {
      await expect(page.locator('h1').first()).toBeVisible()
    }

    // Give deferred local assets and any blocked third-party requests time to settle.
    await page.waitForTimeout(1500)

    const brokenLocalImages = await page
      .locator('img[src^="/"]')
      .evaluateAll((images) =>
        images
          .filter((image) => image.complete && image.naturalWidth === 0)
          .map((image) => image.getAttribute('src'))
      )

    expect(brokenLocalImages, `${route} broken local images`).toEqual([])
    expect(health.localResponses, `${route} served failing local responses`).toEqual([])
    expect(health.failedRequests, `${route} had unapproved failed requests`).toEqual([])
    expect(health.pageErrors, `${route} raised uncaught page errors`).toEqual([])
    expect(health.consoleErrors, `${route} logged unexpected console errors`).toEqual([])
  })
}
