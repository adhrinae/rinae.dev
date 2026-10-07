import { expect, test } from '@playwright/test'

import { readViewTransitionEvents, recordViewTransitions } from './support/view-transitions'

// Ticket 16 runs this file only in the Firefox project. Firefox does not implement the
// cross-document `@view-transition` at-rule, so the site must degrade to ordinary document
// navigations with no view transition and no errors.
test('an unsupported browser navigates normally without view transitions or errors', async ({
  page,
}) => {
  const consoleErrors: string[] = []
  const pageErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() !== 'error') return
    // This environment blocks the remote Google Fonts host, so Firefox reports the failed
    // Noto Sans KR downloads on the console. That is unrelated to view transitions and the
    // page falls back to the system font stack; only other console errors must fail here.
    if (/downloadable font: download failed/.test(message.text())) return
    consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await recordViewTransitions(page)
  await page.goto('/', { waitUntil: 'load' })
  await expect(page.locator('header.custom-header')).toBeVisible()
  await expect(page.locator('html')).toHaveClass(/\b(light|dark)\b/)

  await page.click('.footer-nav a[href="/posts"]')
  await expect(page).toHaveURL(/\/posts$/)
  await expect(page.locator('h1').first()).toHaveText('전체 글')

  await page.goBack()
  await expect(page).toHaveURL(/\/$/)
  await page.goForward()
  await expect(page).toHaveURL(/\/posts$/)

  const events = await readViewTransitionEvents(page)
  expect(
    events.filter((event) => event.hasTransition),
    'Firefox must not run a cross-document view transition'
  ).toEqual([])
  expect(consoleErrors).toEqual([])
  expect(pageErrors).toEqual([])
})
