import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = path.join(repositoryRoot, 'astro-dist')
let buildResult

const buildAstroSite = async () => {
  if (!buildResult) {
    buildResult = spawnSync('pnpm', ['astro:build'], {
      cwd: repositoryRoot,
      encoding: 'utf8',
      timeout: 300_000,
    })
  }

  assert.equal(
    buildResult.status,
    0,
    `Astro build failed (exit ${buildResult.status}):\n${buildResult.stdout}\n${buildResult.stderr}`
  )
}

const baseline = JSON.parse(
  await readFile(
    path.join(repositoryRoot, 'docs/planning/reports/02-baseline/baseline.json'),
    'utf8'
  )
)

const decodeHtml = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/gi, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const normalizeHref = (href) => {
  try {
    return decodeURI(href)
  } catch {
    return href
  }
}

const publicPages = baseline.pages.filter((page) => page.routeKind === 'public-page')
const baselinePage = (route) => publicPages.find((page) => page.route === route)

const postRoutes = (html) =>
  [...html.matchAll(/<a\b[^>]*href="(\/posts\/[^"#?]+)"[^>]*>/g)].map(([, href]) =>
    normalizeHref(href)
  )

const tagListItems = (html) => {
  const match = html.match(/<div class="tag-list">([\s\S]*?)<\/div>/)
  assert.ok(match, 'page must expose the full tag list')
  return [...match[1].matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(
    ([, href, label]) => ({
      href: normalizeHref(href),
      label: decodeHtml(
        label
          .replace(/<[^>]+>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
      ),
    })
  )
}

const postTagRoutes = (html, slug) => {
  const titleLink = `<a href="/posts/${slug}">`
  const titlePosition = html.indexOf(titleLink)
  assert.notEqual(titlePosition, -1, `${slug} must appear in the public posts list`)
  const rowStart = html.lastIndexOf('<div class="post-row">', titlePosition)
  const tagsStart = html.indexOf('<div class="post-tags">', titlePosition)
  const nextRow = html.indexOf('<div class="post-row">', rowStart + '<div class="post-row">'.length)
  assert.ok(tagsStart > titlePosition && (nextRow === -1 || tagsStart < nextRow))
  const tagsEnd = html.indexOf('</div>', tagsStart)
  return [...html.slice(tagsStart, tagsEnd).matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)].map(
    ([, href]) => normalizeHref(href)
  )
}

const relatedHtml = (html) => {
  const start = html.indexOf('<section class="related-posts"')
  assert.notEqual(start, -1, 'article must expose a related posts section')
  const end = html.indexOf('</section>', start)
  assert.notEqual(end, -1, 'related posts section must close')
  return html.slice(start, end)
}

// The baseline renders the tag list last on /posts, so the final 31 tag links are the list in order.
const postsListTagLinks = baselinePage('/posts')
  .internalLinks.filter((link) => link.targetRoute?.startsWith('/tags/'))
  .map((link) => normalizeHref(link.targetRoute))
const expectedTagOrder = postsListTagLinks.slice(-31).map((route) => route.slice('/tags/'.length))
assert.equal(new Set(expectedTagOrder).size, 31, 'baseline tag list must be 31 distinct tags')

const expectedTagCounts = new Map()
for (const post of baseline.frontmatter.posts) {
  for (const tag of post.tags ?? []) {
    expectedTagCounts.set(tag, (expectedTagCounts.get(tag) ?? 0) + 1)
  }
}

const expectedTagListItems = expectedTagOrder.map((name) => ({
  href: `/tags/${name}`,
  label: `${name} (${expectedTagCounts.get(name)})`,
}))

test('home, list, and every tag route expose the full baseline post selection in date order', async () => {
  await buildAstroSite()

  const home = await readFile(path.join(outputRoot, 'index.html'), 'utf8')
  assert.deepEqual(
    postRoutes(home),
    baselinePage('/').contentPostRoutes,
    'home shows the five most recent posts in baseline order'
  )

  const list = await readFile(path.join(outputRoot, 'posts.html'), 'utf8')
  assert.deepEqual(
    postRoutes(list),
    baselinePage('/posts').contentPostRoutes,
    'the list shows every baseline post in baseline order'
  )
  assert.deepEqual(tagListItems(list), expectedTagListItems, 'list tag order and counts')

  for (const tag of expectedTagOrder) {
    const html = await readFile(path.join(outputRoot, 'tags', `${tag}.html`), 'utf8')
    assert.deepEqual(
      postRoutes(html),
      baselinePage(`/tags/${tag}`).contentPostRoutes,
      `${tag} posts must match the baseline subset`
    )
    assert.deepEqual(tagListItems(html), expectedTagListItems, `${tag} More tags list`)
  }
})

test('public post-list tag links and article related posts follow the full baseline selection', async () => {
  await buildAstroSite()

  const list = await readFile(path.join(outputRoot, 'posts.html'), 'utf8')
  for (const post of baseline.frontmatter.posts) {
    assert.deepEqual(
      postTagRoutes(list, post.slug),
      post.tags.map((tag) => `/tags/${tag}`),
      `${post.slug} should link each displayed tag to its public route`
    )

    const html = await readFile(path.join(outputRoot, 'posts', `${post.slug}.html`), 'utf8')
    const related = relatedHtml(html)
    assert.match(related, /aria-label="관련 글"/)
    const actualRoutes = postRoutes(related)
    assert.deepEqual(actualRoutes, baselinePage(`/posts/${post.slug}`).relatedPostRoutes)
    assert.ok(actualRoutes.length <= 5, 'related posts must never exceed five results')
    assert.equal(actualRoutes.includes(`/posts/${post.slug}`), false, 'current article excluded')
  }
})
