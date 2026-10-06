import { expect, test, type Page } from '@playwright/test'

import {
  readViewTransitionAnimations,
  readViewTransitionEvents,
  recordViewTransitions,
} from './support/view-transitions'

const CODE_POST = '/posts/review-when-to-usememo-and-usecallback'
const GISCUS_POST = '/posts/recreating-blog-2025'

// Chromium intermittently declines to start a cross-document view transition for a document
// that is not the focused page under parallel load, so a single navigation is not a reliable
// observation. Each check walks the footer links a few times instead.
const NAVIGATION_ATTEMPTS = 6
const TRANSITION_SETTLE_MS = 300

const searchInput = (page: Page) => page.locator('pagefind-searchbox input').first()

const openSearch = async (page: Page) => {
  const shortcut = (await searchInput(page).getAttribute('aria-keyshortcuts')) ?? 'Control+k'
  const modifier = shortcut.startsWith('Meta') ? 'Meta' : 'Control'
  await page.keyboard.press(`${modifier}+k`)
}

// Click the footer link that leads to the other side of the Home <-> Posts pair.
const navigateAcrossFooter = async (page: Page) => {
  const goingHome = page.url().endsWith('/posts')
  await page.click(`.footer-nav a[href="${goingHome ? '/' : '/posts'}"]`)
  await expect(page).toHaveURL(goingHome ? /\/$/ : /\/posts$/)
  await page.waitForTimeout(TRANSITION_SETTLE_MS)
}

test.use({ permissions: ['clipboard-read', 'clipboard-write'] })

test('footer link navigations run a native cross-document view transition', async ({ page }) => {
  await recordViewTransitions(page)
  await page.goto('/')
  await page.bringToFront()

  let observedTransition = false
  for (let attempt = 0; attempt < NAVIGATION_ATTEMPTS && !observedTransition; attempt += 1) {
    await navigateAcrossFooter(page)

    const events = await readViewTransitionEvents(page)
    const animations = await readViewTransitionAnimations(page)
    observedTransition =
      events.some((event) => event.hasTransition) &&
      animations.length > 0 &&
      animations.every((animation) => (animation.duration ?? 0) > 0)
  }

  expect(
    observedTransition,
    'a same-origin navigation must reveal an active transition with non-zero-duration animations'
  ).toBe(true)
})

test.describe('prefers-reduced-motion: reduce', () => {
  // Set at context creation; toggling with `page.emulateMedia` mid-test was unreliable here.
  test.use({ reducedMotion: 'reduce' })

  test('suppresses the transition animation', async ({ page }) => {
    await recordViewTransitions(page)
    await page.goto('/')
    await page.bringToFront()

    // Chromium may skip the cross-document transition entirely under reduced motion, or run it
    // with the animations removed by the global stylesheet; both are correct. The contract is
    // that no view transition animation plays, unlike the un-reduced navigation asserted above.
    let animatedFrames = 0
    for (let attempt = 0; attempt < NAVIGATION_ATTEMPTS; attempt += 1) {
      await navigateAcrossFooter(page)
      const animations = await readViewTransitionAnimations(page)
      animatedFrames += animations.filter((animation) => (animation.duration ?? 0) > 0).length
    }

    expect(animatedFrames, 'no view transition animation may run under reduced motion').toBe(0)
  })
})

test('theme, search, code copy, and Giscus keep working after a navigation without re-initialization', async ({
  page,
}) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  // Theme toggle: the selection is made on the home page ...
  const initial = (await page.locator('html').getAttribute('class')) ?? ''
  const toggled = initial.includes('dark') ? 'light' : 'dark'
  await page.click('[data-theme-toggle]')
  await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${toggled}\\b`))

  // ... and survives a full-document link navigation.
  await page.click('.footer-nav a[href="/posts"]')
  await expect(page).toHaveURL(/\/posts$/)
  await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${toggled}\\b`))
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(toggled)

  // Search: the Pagefind custom element binds itself on the navigated document.
  await openSearch(page)
  await searchInput(page).fill('블로그')
  await expect(page.locator('pagefind-searchbox .pf-searchbox-result-title').first()).toHaveText(
    '블로그 다시 만들기'
  )
  await page.keyboard.press('Escape')

  // Code copy: the enhancer builds its toolbar on the navigated post.
  await page.click(`.post-list a[href="${CODE_POST}"]`)
  await expect(page).toHaveURL(new RegExp(`${CODE_POST}$`))
  const copyButton = page.locator('.code-copy-button').first()
  await expect(copyButton).toBeVisible()
  const codeText = await page
    .locator('.reading-post pre code')
    .first()
    .evaluate((code) => code.textContent)
  await copyButton.click()
  await expect(page.locator('.code-copy-status').first()).toHaveAttribute('data-state', 'success')
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(codeText)

  // Giscus: the embed loads on the comment-enabled post reached by navigation.
  await page.click('.footer-nav a[href="/posts"]')
  await page.click(`.post-list a[href="${GISCUS_POST}"]`)
  await expect(page).toHaveURL(new RegExp(`${GISCUS_POST}$`))
  await expect(page.locator('script[src="https://giscus.app/client.js"]')).toHaveCount(1)
  await expect(page.locator('iframe[src*="giscus.app"]').first()).toBeVisible({ timeout: 30_000 })
})
