import type { Page } from '@playwright/test'

export const searchInput = (page: Page) => page.locator('pagefind-searchbox input').first()

// The searchbox binds `mod+k`, which resolves to Meta on macOS and Control elsewhere. Read
// the binding the component actually declared so the shortcut test follows the live browser.
export const openSearch = async (page: Page) => {
  const shortcut = (await searchInput(page).getAttribute('aria-keyshortcuts')) ?? 'Control+k'
  const modifier = shortcut.startsWith('Meta') ? 'Meta' : 'Control'
  await page.keyboard.press(`${modifier}+k`)
}
