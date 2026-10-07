import assert from 'node:assert/strict'
import { test } from 'node:test'
import { compareBaselines } from './compare-site-baseline.mjs'

function baseline(overrides = {}) {
  return {
    generatedAt: '2026-10-04T05:00:00.000Z',
    siteDirectory: '/tmp/first/out',
    contentDirectory: '/tmp/first/content',
    origin: 'https://rinae.dev',
    routes: [
      { route: '/', kind: 'public-page', file: 'index.html' },
      { route: '/posts/one', kind: 'public-page', file: 'posts/one.html' },
    ],
    pages: [
      { route: '/', headings: [{ level: 1, id: 'home', text: 'Home' }] },
      { route: '/posts/one', headings: [{ level: 1, id: 'one', text: 'One' }] },
    ],
    frontmatter: { posts: [{ source: 'posts/one.mdx', title: 'One', date: '2024-01-01' }] },
    findings: [],
    ...overrides,
  }
}

test('ignores run-specific timestamps and absolute collection directories', () => {
  const before = baseline()
  const after = baseline({
    generatedAt: '2026-10-04T06:00:00.000Z',
    siteDirectory: '/tmp/second/out',
    contentDirectory: '/tmp/second/content',
  })

  const result = compareBaselines(before, after)
  assert.equal(result.equal, true)
  assert.deepEqual(result.changes, [])
})

test('reports new public routes and rendered heading ID changes by route', () => {
  const before = baseline()
  const newPage = { route: '/posts/two', headings: [{ level: 1, id: 'two', text: 'Two' }] }
  const after = baseline({
    routes: [
      ...before.routes,
      { route: '/posts/two', kind: 'public-page', file: 'posts/two.html' },
    ],
    pages: [
      before.pages[0],
      { route: '/posts/one', headings: [{ level: 1, id: 'renamed', text: 'One' }] },
      newPage,
    ],
  })

  const result = compareBaselines(before, after)
  assert.equal(result.equal, false)
  assert.ok(
    result.changes.some(
      (change) => change.path === '$.routes["/posts/two"]' && change.type === 'added'
    )
  )
  assert.ok(
    result.changes.some(
      (change) => change.path === '$.pages["/posts/two"]' && change.type === 'added'
    )
  )
  assert.ok(
    result.changes.some(
      (change) =>
        change.path === '$.pages["/posts/one"].headings[0].id' &&
        change.before === 'one' &&
        change.after === 'renamed'
    )
  )
})
