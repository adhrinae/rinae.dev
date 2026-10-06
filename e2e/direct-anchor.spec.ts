import { expect, test } from '@playwright/test'

// Ticket 11 entry point: mobile dark-mode direct hash entry (contents loaded from the URL).
test.use({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' })

const POST = '/posts/the-fine-art-of-fast-development-kr-1'

for (const id of ['길고-두서없는-서문', '1-당신이-시간을-어떻게-쓰는지-측정하라']) {
  test(`opening /#${id} directly lands on the heading`, async ({ page }) => {
    const encoded = encodeURIComponent(id)
    await page.goto(`${POST}#${encoded}`, { waitUntil: 'load' })

    await expect(page).toHaveURL(new RegExp(`#${encoded}$`))
    const target = page.locator(`[id="${id}"]`)
    await expect(target).toHaveCount(1)

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
    await expect
      .poll(() => target.evaluate((heading) => heading.getBoundingClientRect().top))
      .toBeLessThan(200)
  })
}
