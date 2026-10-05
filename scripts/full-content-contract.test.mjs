import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { access, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = path.join(repositoryRoot, 'astro-dist')
const baselinePath = path.join(repositoryRoot, 'docs/planning/reports/02-baseline/baseline.json')

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

const loadBaseline = async () => JSON.parse(await readFile(baselinePath, 'utf8'))

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

const renderedHeadings = (html) =>
  [...html.matchAll(/<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/g)].map(
    ([, level, attributes, contents]) => ({
      level: Number(level),
      id: attributes.match(/\bid="([^"]*)"/)?.[1] ?? null,
      text: decodeHtml(contents.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ')).trim(),
    })
  )

const renderedIds = (html) => new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id))

const localImageSources = (html) =>
  [...html.matchAll(/<img\b[^>]*>/g)]
    .map(([tag]) => tag.match(/\bsrc="([^"]+)"/)?.[1])
    .filter((src) => typeof src === 'string' && src.startsWith('/') && !src.includes('?'))

const giscusLoaded = (html) => html.includes('giscus.app/client.js')

const pageFile = (page) => path.join(outputRoot, page.file)

const publicPages = (baseline) => baseline.pages.filter((page) => page.routeKind === 'public-page')

test('full content build emits every baseline public route with identical headings and element counts', async () => {
  await buildAstroSite()
  const baseline = await loadBaseline()
  const pages = publicPages(baseline)

  const posts = pages.filter((page) => page.route.startsWith('/posts/'))
  const tags = pages.filter((page) => page.route.startsWith('/tags/'))
  const fixed = pages.filter(
    (page) => !page.route.startsWith('/posts/') && !page.route.startsWith('/tags/')
  )
  assert.equal(posts.length, 86, 'baseline public post count')
  assert.equal(tags.length, 31, 'baseline public tag count')
  assert.deepEqual(
    fixed.map((page) => page.route).sort(),
    ['/', '/colophon', '/posts'],
    'baseline fixed page routes'
  )

  for (const page of pages) {
    const html = await readFile(pageFile(page), 'utf8')
    assert.deepEqual(renderedHeadings(html), page.headings, `${page.route} heading parity`)

    const counts = {
      iframes: [...html.matchAll(/<iframe\b/g)].length,
      images: [...html.matchAll(/<img\b/g)].length,
      codeBlocks: [...html.matchAll(/<pre\b/g)].length,
    }
    assert.deepEqual(
      counts,
      {
        iframes: page.counts.iframes,
        images: page.counts.images,
        codeBlocks: page.counts.codeBlocks,
      },
      `${page.route} element counts`
    )
  }

  const emittedPosts = (await readdir(path.join(outputRoot, 'posts'))).filter((name) =>
    name.endsWith('.html')
  )
  const emittedTags = (await readdir(path.join(outputRoot, 'tags'))).filter((name) =>
    name.endsWith('.html')
  )
  assert.equal(emittedPosts.length, posts.length, 'no extra or missing post outputs')
  assert.equal(emittedTags.length, tags.length, 'no extra or missing tag outputs')
})

test('full content preserves same-page anchors, local images, and internal targets', async () => {
  await buildAstroSite()
  const baseline = await loadBaseline()

  for (const page of publicPages(baseline)) {
    const html = await readFile(pageFile(page), 'utf8')
    const ids = renderedIds(html)

    for (const link of page.internalLinks) {
      if (link.fragment && link.exists && link.targetRoute === page.route) {
        assert.ok(ids.has(link.fragment), `${page.route} must keep anchor #${link.fragment}`)
      }
      if (
        link.internal &&
        link.targetRoute &&
        (link.targetRoute.startsWith('/posts/') || link.targetRoute.startsWith('/tags/'))
      ) {
        await access(path.join(outputRoot, `${normalizeHref(link.targetRoute).slice(1)}.html`))
      }
    }

    for (const source of localImageSources(html)) {
      await access(path.join(outputRoot, source.slice(1)))
    }
  }
})

test('comment policy follows baseline enableComment across the full content set', async () => {
  await buildAstroSite()
  const baseline = await loadBaseline()
  const enabledRoutes = new Set(
    baseline.frontmatter.posts
      .filter((post) => post.enableComment === true)
      .map((post) => `/posts/${post.slug}`)
  )
  assert.deepEqual([...enabledRoutes], ['/posts/recreating-blog-2025'])

  for (const page of publicPages(baseline).filter((page) => page.route.startsWith('/posts/'))) {
    const html = await readFile(pageFile(page), 'utf8')
    assert.equal(giscusLoaded(html), enabledRoutes.has(page.route), `${page.route} Giscus policy`)
  }
})
