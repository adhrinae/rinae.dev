import { expect, test, type Page } from '@playwright/test'

const searchInput = (page: Page) => page.locator('pagefind-searchbox input').first()

// The searchbox binds `mod+k`, which resolves to Meta on macOS and Control elsewhere. Read
// the binding the component actually declared so the shortcut test follows the live browser.
const openSearch = async (page: Page) => {
  const shortcut = (await searchInput(page).getAttribute('aria-keyshortcuts')) ?? 'Control+k'
  const modifier = shortcut.startsWith('Meta') ? 'Meta' : 'Control'
  await page.keyboard.press(`${modifier}+k`)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('the platform shortcut opens and focuses the search input', async ({ page }) => {
  await openSearch(page)
  await expect(searchInput(page)).toBeFocused()
})

test('a Korean query returns matching posts', async ({ page }) => {
  await openSearch(page)
  await searchInput(page).fill('블로그')

  await expect(page.locator('pagefind-searchbox .pf-searchbox-result-title').first()).toHaveText(
    '블로그 다시 만들기'
  )
  expect(await searchInput(page).getAttribute('aria-expanded')).toBe('true')
})

test('a consecutive search replaces the previous results', async ({ page }) => {
  await openSearch(page)

  await searchInput(page).fill('블로그')
  await expect(page.locator('pagefind-searchbox .pf-searchbox-result-title').first()).toHaveText(
    '블로그 다시 만들기'
  )

  await searchInput(page).fill('자바스크립트')
  await expect(searchInput(page)).toHaveValue('자바스크립트')
  await expect(page.locator('pagefind-searchbox .pf-searchbox-result-title').first()).toHaveText(
    '함수형 자바스크립트(루이스 아텐시오 저) 리뷰'
  )
})

test('a query with no matches shows the empty state', async ({ page }) => {
  await openSearch(page)
  await searchInput(page).fill('ㅁㄴㅇㄹ')

  await expect(page.locator('pagefind-searchbox .pf-searchbox-status')).toContainText('결과 없음')
  await expect(page.locator('pagefind-searchbox .pf-searchbox-empty')).toBeVisible()
  await expect(page.locator('pagefind-searchbox .pf-searchbox-result')).toHaveCount(0)
})

test('keyboard selection moves through results and Enter opens the target', async ({ page }) => {
  await openSearch(page)
  await searchInput(page).fill('리액트')

  const selected = page.locator('pagefind-searchbox .pf-searchbox-result[aria-selected="true"]')
  await expect(selected).toHaveCount(1)

  await page.keyboard.press('ArrowDown')
  await expect(selected).toHaveCount(1)
  const href = await selected.getAttribute('href')
  expect(href).toMatch(/^\/posts\//)

  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(new RegExp(`${href}$`))
})

test('Escape closes the open search panel', async ({ page }) => {
  await openSearch(page)
  await searchInput(page).fill('블로그')
  await expect(page.locator('pagefind-searchbox .pf-searchbox.open')).toHaveCount(1)

  await page.keyboard.press('Escape')
  await expect(page.locator('pagefind-searchbox .pf-searchbox.open')).toHaveCount(0)
  await expect(searchInput(page)).toHaveAttribute('aria-expanded', 'false')
})
