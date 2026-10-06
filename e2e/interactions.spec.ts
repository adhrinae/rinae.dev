import { expect, test } from '@playwright/test'

const FINE_ART_POST = '/posts/the-fine-art-of-fast-development-kr-1'
const CODE_POST = '/posts/review-when-to-usememo-and-usecallback'

test.use({ permissions: ['clipboard-read', 'clipboard-write'] })

test('theme toggle persists the selected theme across a reload', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  const initial = (await page.locator('html').getAttribute('class')) ?? ''
  expect(initial).toMatch(/\b(light|dark)\b/)
  const toggled = initial.includes('dark') ? 'light' : 'dark'

  await page.click('[data-theme-toggle]')
  await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${toggled}\\b`))
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(toggled)

  await page.reload()
  await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${toggled}\\b`))
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(toggled)
})

test('the article TOC links to every heading and collapses and expands', async ({ page }) => {
  await page.goto(FINE_ART_POST)

  const details = page.locator('.toc details')
  expect(await details.evaluate((element) => element.open)).toBe(true)
  await expect(page.locator('.toc summary')).toContainText('목차')

  const tocIds = await page
    .locator('.toc a')
    .evaluateAll((links) =>
      links.map((link) => decodeURIComponent(link.getAttribute('href')!.slice(1)))
    )
  const headingIds = await page
    .locator(
      '.reading-post h2, .reading-post h3, .reading-post h4, .reading-post h5, .reading-post h6'
    )
    .evaluateAll((headings) =>
      headings.filter((heading) => !heading.closest('.related-posts')).map((heading) => heading.id)
    )
  expect(tocIds).toEqual(headingIds)

  const depths = await page.locator('.toc a').evaluateAll((links) =>
    links.map((link) => {
      let depth = 0
      let node: Element | null = link.parentElement
      while (node) {
        if (node.classList.contains('toc-list')) depth += 1
        node = node.parentElement
      }
      return depth
    })
  )
  expect(depths[0]).toBe(1)
  expect(depths[1]).toBe(2)
  expect(depths[3]).toBe(1)

  await page.click('.toc summary')
  expect(await details.evaluate((element) => element.open)).toBe(false)
  await page.click('.toc summary')
  expect(await details.evaluate((element) => element.open)).toBe(true)
})

test('clicking a TOC item moves to its heading and updates the hash', async ({ page }) => {
  await page.goto(FINE_ART_POST)

  const firstLink = page.locator('.toc a').first()
  const href = await firstLink.getAttribute('href')
  expect(href).toMatch(/^#.+/)
  const id = decodeURIComponent(href!.slice(1))

  await firstLink.click()
  await expect(page).toHaveURL(new RegExp(`#${encodeURIComponent(id)}$`))
  expect(await page.evaluate((target) => Boolean(document.getElementById(target)), id)).toBe(true)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
})

test('footer navigation supports browser back and forward', async ({ page }) => {
  await page.goto('/')
  await page.click('.footer-nav a[href="/posts"]')
  await expect(page).toHaveURL(/\/posts$/)
  await expect(page.locator('h1').first()).toHaveText('전체 글')

  await page.goBack()
  await expect(page).toHaveURL(/\/$/)
  await page.goForward()
  await expect(page).toHaveURL(/\/posts$/)
})

test('code copy copies the block text on every repeated click', async ({ page }) => {
  await page.goto(CODE_POST)

  const button = page.locator('.code-copy-button').first()
  const status = page.locator('.code-copy-status').first()
  await expect(button).toBeVisible()
  await expect(button).toHaveAttribute('aria-label', '코드 복사')

  const codeText = await page
    .locator('.reading-post pre code')
    .first()
    .evaluate((code) => code.textContent)
  expect(codeText).toBeTruthy()

  for (let run = 1; run <= 3; run += 1) {
    await button.click()
    await expect(status).toHaveAttribute('data-state', 'success')
    await expect(status).toHaveText('코드가 복사되었습니다.')
    const clipboard = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboard, `copy run ${run} must match the code block`).toBe(codeText)
  }
})
