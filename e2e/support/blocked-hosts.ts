import type { Page } from '@playwright/test'

// AdGuard Home DNS blocks these hosts in this environment, so their failed requests are
// permitted. The first three are the hosts named in ticket 13; the ad/tracking hosts after
// them are the additionally blocked hosts observed while serving the built site locally.
// Any other failed host request must fail the test.
//
// This allowlist is a local-environment accommodation only. CI runners have no DNS filter, so
// it is not a CI workaround and must not be widened to make CI pass (ticket 17); see
// .github/workflows/ci.yml for how CI treats third-party host failures.
export const BLOCKED_HOSTS = [
  'static.cloudflareinsights.com',
  'syndication.twitter.com',
  'platform.twitter.com',
  'syndication.x.com',
  'static.doubleclick.net',
  'googleads.g.doubleclick.net',
] as const

const blockedHostSet = new Set<string>(BLOCKED_HOSTS)

export const isBlockedHostUrl = (url: string): boolean => {
  try {
    return blockedHostSet.has(new URL(url).host)
  } catch {
    return false
  }
}

// `page.on('console')` reports blocked-resource load failures without a useful host, so a
// generic resource-load message is also allowed: the request-failure check above is the
// authoritative allowlist gate.
const isBlockedResourceConsoleError = (message: string): boolean =>
  message.includes('Failed to load resource')

export const watchNetworkHealth = (page: Page) => {
  const failedRequests: string[] = []
  const consoleErrors: string[] = []
  const pageErrors: string[] = []

  page.on('requestfailed', (request) => {
    if (isBlockedHostUrl(request.url())) return
    failedRequests.push(`${request.url()} :: ${request.failure()?.errorText ?? 'unknown'}`)
  })
  page.on('console', (message) => {
    if (message.type() !== 'error') return
    if (isBlockedHostUrl(message.location().url)) return
    if (isBlockedResourceConsoleError(message.text())) return
    consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => pageErrors.push(error.message))

  return { failedRequests, consoleErrors, pageErrors }
}
