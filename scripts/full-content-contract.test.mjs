import assert from 'node:assert/strict'
import { access, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'

import {
  createCachedAstroBuild,
  decodeFragment,
  decodePath,
  hrefs,
  outputRoot,
  renderedHeadings,
  repositoryRoot,
} from './lib/astro-test-helpers.mjs'

const baselinePath = path.join(repositoryRoot, 'docs/planning/reports/02-baseline/baseline.json')
const buildAstroSite = createCachedAstroBuild('Astro full-content build')

const loadBaseline = async () => JSON.parse(await readFile(baselinePath, 'utf8'))

const publicPages = (baseline) => baseline.pages.filter((page) => page.routeKind === 'public-page')

const pageFile = (page) => path.join(outputRoot, page.file)

const renderedIds = (html) => new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id))

const localImageSources = (html) =>
  [...html.matchAll(/<img\b[^>]*>/g)]
    .map(([tag]) => tag.match(/\bsrc="([^"]+)"/)?.[1])
    .filter((src) => typeof src === 'string' && src.startsWith('/') && !src.includes('?'))

const giscusLoaded = (html) => html.includes('giscus.app/client.js')

const baselineCrossRouteLinks = (page) => {
  const links = new Set()
  for (const link of page.internalLinks) {
    if (!link.internal || !link.targetRoute || link.targetRoute === page.route) continue
    if (!(link.targetRoute.startsWith('/posts/') || link.targetRoute.startsWith('/tags/'))) continue
    links.add(
      decodePath(link.targetRoute) + (link.fragment ? `#${decodeFragment(link.fragment)}` : '')
    )
  }
  return links
}

const emittedCrossRouteLinks = (page, html) => {
  const links = new Set()
  for (let href of hrefs(html)) {
    if (href.startsWith('https://rinae.dev')) href = href.slice('https://rinae.dev'.length)
    if (!href.startsWith('/')) continue
    const hash = href.indexOf('#')
    const pathname = hash === -1 ? href : href.slice(0, hash)
    const fragment = hash === -1 ? '' : href.slice(hash + 1)
    if (!(pathname.startsWith('/posts/') || pathname.startsWith('/tags/'))) continue
    if (pathname === page.route) continue
    links.add(decodePath(pathname) + (fragment ? `#${decodeFragment(fragment)}` : ''))
  }
  return links
}

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

test('full content keeps every baseline content link, anchor target, and local image', async () => {
  await buildAstroSite()
  const baseline = await loadBaseline()
  const pages = publicPages(baseline)
  const pagesByRoute = new Map(pages.map((page) => [page.route, page]))
  const idsByRoute = new Map()

  const idsFor = async (page) => {
    if (!idsByRoute.has(page.route)) {
      idsByRoute.set(page.route, renderedIds(await readFile(pageFile(page), 'utf8')))
    }
    return idsByRoute.get(page.route)
  }

  for (const page of pages) {
    const html = await readFile(pageFile(page), 'utf8')

    const emitted = emittedCrossRouteLinks(page, html)
    for (const link of baselineCrossRouteLinks(page)) {
      assert.ok(emitted.has(link), `${page.route} must keep its content link to ${link}`)
    }

    for (const link of page.internalLinks) {
      if (!link.internal || !link.fragment || !link.exists || !link.targetRoute) continue
      const destination = pagesByRoute.get(link.targetRoute)
      assert.ok(destination, `${page.route} links to an unknown route ${link.targetRoute}`)
      const ids = await idsFor(destination)
      assert.ok(
        ids.has(link.fragment) || ids.has(decodeFragment(link.fragment)),
        `${link.targetRoute} must keep anchor #${link.fragment}`
      )
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
