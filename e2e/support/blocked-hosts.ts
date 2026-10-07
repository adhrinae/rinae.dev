import type { Page } from '@playwright/test'

// AdGuard Home DNS blocks these hosts in this environment, so their failed requests are
// permitted locally. The first three are the hosts named in ticket 13; the ad/tracking hosts
// after them are the additionally blocked hosts observed while serving the built site locally.
// Any other failed host request must fail the test.
//
// This allowlist is a local-environment accommodation only and is disabled whenever
// `process.env.CI` is set. CI runners have no DNS filter, so in CI every failed host request
// fails the test and the generic console suppression below is inert (ticket 17); see
// .github/workflows/ci.yml for how CI treats third-party host failures.
export const BLOCKED_HOSTS = [
  'static.cloudflareinsights.com',
  'syndication.twitter.com',
  'platform.twitter.com',
  'syndication.x.com',
  'static.doubleclick.net',
  'googleads.g.doubleclick.net',
] as const

const localAllowlistEnabled = !process.env.CI

const blockedHostSet = new Set<string>(BLOCKED_HOSTS)

export const isBlockedHostUrl = (url: string): boolean => {
  try {
    return blockedHostSet.has(new URL(url).host)
  } catch {
    return false
  }
}

// `page.on('console')` reports blocked-resource load failures without a useful host, so a
// generic resource-load message is also allowed — but only when an allowlisted host request
// actually failed on this page (counted in the `requestfailed` handler). Unrelated resource
// errors are recorded.
const isBlockedResourceConsoleError = (message: string): boolean =>
  message.includes('Failed to load resource')

const isLocalHostname = (hostname: string): boolean =>
  hostname === '127.0.0.1' || hostname === 'localhost'

export const watchNetworkHealth = (page: Page) => {
  const failedRequests: string[] = []
  const consoleErrors: string[] = []
  const pageErrors: string[] = []
  const localResponses: string[] = []

  let blockedHostFailures = 0

  page.on('requestfailed', (request) => {
    if (localAllowlistEnabled && isBlockedHostUrl(request.url())) {
      blockedHostFailures += 1
      return
    }
    failedRequests.push(`${request.url()} :: ${request.failure()?.errorText ?? 'unknown'}`)
  })
  page.on('response', (response) => {
    // A local 404 does not emit `requestfailed`, so same-origin HTTP errors are checked here.
    const { hostname } = new URL(response.url())
    if (!isLocalHostname(hostname)) return
    if (response.status() < 400) return
    localResponses.push(`${response.status()} ${response.url()}`)
  })
  page.on('console', (message) => {
    if (message.type() !== 'error') return
    if (localAllowlistEnabled && isBlockedHostUrl(message.location().url)) return
    if (
      localAllowlistEnabled &&
      blockedHostFailures > 0 &&
      isBlockedResourceConsoleError(message.text())
    ) {
      return
    }
    consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => pageErrors.push(error.message))

  return { failedRequests, consoleErrors, pageErrors, localResponses }
}
