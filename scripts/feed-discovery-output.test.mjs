import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import test from 'node:test'

import {
  createCachedAstroBuild,
  decodeHtml,
  outputRoot,
  repositoryRoot,
} from './lib/astro-test-helpers.mjs'

const require = createRequire(import.meta.url)
// `sax` lives in the pinned pnpm store as a transitive package. The baseline
// collector vendors transitive parsers the same way, so this adds no dependency.
const sax = require('../node_modules/.pnpm/sax@1.6.1/node_modules/sax')

const baselineRoot = path.join(repositoryRoot, 'scripts/fixtures/site-baseline')
const baselinePath = path.join(baselineRoot, 'baseline.json')
const baselineRssPath = path.join(baselineRoot, 'http/rss.xml.body')
const baselineRobotsPath = path.join(baselineRoot, 'http/robots.txt.body')
const buildAstroSite = createCachedAstroBuild('Astro feed/discovery build')
const PRODUCTION_ORIGIN = 'https://rinae.dev'

const loadBaseline = async () => JSON.parse(await readFile(baselinePath, 'utf8'))

const publicPages = (baseline) => baseline.pages.filter((page) => page.routeKind === 'public-page')

const artifact = (name) => readFile(path.join(outputRoot, name), 'utf8')

const rssItems = (xml) => [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, body]) => body)

const xmlField = (block, tag) => {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`))
  return match ? match[1] : null
}

const xmlAttribute = (block, tag, attribute) => {
  const match = block.match(new RegExp(`<${tag}\\s[^>]*\\b${attribute}="([^"]*)"[^>]*>`))
  return match ? match[1] : null
}

const sitemapLocations = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc)

const sitemapBlocks = (xml) => [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, body]) => body)

const metaTags = (html) =>
  [...html.matchAll(/<meta\b[^>]*>/g)].map(([tag]) => ({
    name: tag.match(/\bname="([^"]*)"/)?.[1] ?? null,
    property: tag.match(/\bproperty="([^"]*)"/)?.[1] ?? null,
    content: tag.match(/\bcontent="([^"]*)"/)?.[1] ?? null,
  }))

const pageTitle = (html) => decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '')

const pageDescription = (html) => {
  const matches = metaTags(html).filter((meta) => meta.name === 'description')
  assert.equal(matches.length, 1, 'exactly one meta[name=description]')
  return decodeHtml(matches[0].content ?? '')
}

const openGraph = (html) => metaTags(html).filter((meta) => meta.property?.startsWith('og:'))
const twitter = (html) => metaTags(html).filter((meta) => meta.name?.startsWith('twitter:'))
const canonical = (html) => html.match(/<link\b[^>]*rel="canonical"[^>]*>/)?.[0] ?? null

const assertWellFormedXml = (xml, label) => {
  const errors = []
  const parser = sax.parser(true)
  parser.onerror = (error) => errors.push(error.message)
  try {
    parser.write(xml)
    parser.close()
  } catch (error) {
    errors.push(error.message)
  }
  assert.deepEqual(errors, [], `${label} must be well-formed XML`)
}

test('RSS artifact matches the baseline feed contract item by item', async () => {
  await buildAstroSite()
  const [xml, baselineXml] = await Promise.all([
    artifact('rss.xml'),
    readFile(baselineRssPath, 'utf8'),
  ])

  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8" ?>'), 'XML declaration')
  assert.match(xml, /<rss version="2\.0">/)
  assert.equal(
    xmlField(xml.match(/<channel>([\s\S]*?)<\/channel>/)[1], 'title'),
    'Read, Think and Code'
  )
  assert.equal(xmlField(xml.match(/<channel>([\s\S]*?)<\/channel>/)[1], 'language'), 'ko-kr')
  assertWellFormedXml(xml, 'rss.xml')

  const items = rssItems(xml)
  const baselineItems = rssItems(baselineXml)
  assert.equal(items.length, 86, 'all published posts are in the feed')
  assert.equal(items.length, baselineItems.length, 'feed item count matches baseline')

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index]
    const expected = baselineItems[index]
    const link = xmlField(item, 'link')

    assert.equal(xmlField(item, 'title'), xmlField(expected, 'title'), `item ${index} title`)
    assert.equal(
      xmlField(item, 'description'),
      xmlField(expected, 'description'),
      `item ${index} description`
    )
    assert.equal(link, xmlField(expected, 'link'), `item ${index} link`)
    assert.equal(
      link,
      `${PRODUCTION_ORIGIN}${new URL(link).pathname}`,
      `item ${index} absolute link`
    )
    assert.equal(xmlField(item, 'guid'), link, `item ${index} guid equals link`)
    assert.equal(xmlAttribute(item, 'guid', 'isPermaLink'), 'true', `item ${index} guid permalink`)
    assert.equal(xmlField(item, 'pubDate'), xmlField(expected, 'pubDate'), `item ${index} pubDate`)
    assert.ok(!Number.isNaN(Date.parse(xmlField(item, 'pubDate'))), `item ${index} pubDate parses`)
  }

  const escapedTitle = items
    .map((item) => xmlField(item, 'title'))
    .find((title) => title.includes('&apos;'))
  assert.ok(escapedTitle, 'apostrophes are XML escaped')
})

test('sitemap artifact lists exactly the baseline public non-tag routes', async () => {
  await buildAstroSite()
  const xml = await artifact('sitemap.xml')
  assertWellFormedXml(xml, 'sitemap.xml')

  const baseline = await loadBaseline()
  const expected = publicPages(baseline)
    .filter((page) => !page.route.startsWith('/tags/'))
    .map((page) => `${PRODUCTION_ORIGIN}${page.route}`)
    .sort()
  const locations = sitemapLocations(xml).sort()

  assert.equal(locations.length, 89, 'sitemap entry count')
  assert.deepEqual(locations, expected, 'sitemap covers all public content and hides tag routes')
  assert.ok(
    locations.every(
      (location) =>
        location.startsWith(`${PRODUCTION_ORIGIN}/`) || location === `${PRODUCTION_ORIGIN}/`
    ),
    'sitemap uses the production origin only'
  )

  const blocks = sitemapBlocks(xml)
  const lastModified = blocks.map((block) => xmlField(block, 'lastmod'))
  assert.equal(new Set(lastModified).size, 1, 'one build timestamp is reused')
  assert.ok(!Number.isNaN(Date.parse(lastModified[0])), 'lastmod is an ISO timestamp')

  for (const block of blocks) {
    const location = xmlField(block, 'loc')
    assert.equal(xmlField(block, 'changefreq'), 'weekly', `${location} changefreq`)
    assert.equal(
      xmlField(block, 'priority'),
      location === `${PRODUCTION_ORIGIN}/` ? '1' : '0.8',
      `${location} priority`
    )
  }
})

test('robots.txt artifact keeps the baseline allow/disallow and sitemap policy', async () => {
  await buildAstroSite()
  const [robots, baselineRobots] = await Promise.all([
    artifact('robots.txt'),
    readFile(baselineRobotsPath, 'utf8'),
  ])
  assert.equal(robots, baselineRobots, 'robots.txt matches the baseline body')
  assert.match(robots, /^User-Agent: \*$/m)
  assert.match(robots, /^Allow: \/$/m)
  assert.match(robots, /^Disallow: \/private\/$/m)
  assert.match(robots, /^Sitemap: https:\/\/rinae\.dev\/sitemap\.xml$/m)
})

test('XML well-formedness checks reject malformed feeds and sitemaps', () => {
  assert.throws(
    () =>
      assertWellFormedXml(
        '<?xml version="1.0"?><rss><channel></wrong></channel></rss>',
        'mismatched-tag fixture'
      ),
    /must be well-formed XML/,
    'mismatched closing tag is rejected'
  )
  assert.throws(
    () =>
      assertWellFormedXml(
        '<?xml version="1.0"?><rss><title>a & b</title></rss>',
        'unescaped-ampersand fixture'
      ),
    /must be well-formed XML/,
    'unescaped ampersand is rejected'
  )
  assert.doesNotThrow(() =>
    assertWellFormedXml(
      '<?xml version="1.0"?><rss><title>a &amp; b</title></rss>',
      'escaped-ampersand fixture'
    )
  )
})

test('every public page head matches baseline title, description and sharing metadata', async () => {
  await buildAstroSite()
  const baseline = await loadBaseline()
  const pages = publicPages(baseline)
  assert.equal(pages.length, 120, 'baseline public page count')

  for (const page of pages) {
    const html = await readFile(path.join(outputRoot, page.file), 'utf8')
    assert.equal(pageTitle(html), page.metadata.title, `${page.route} title`)
    assert.equal(pageDescription(html), page.metadata.description, `${page.route} description`)
    assert.equal(canonical(html), page.metadata.canonical, `${page.route} canonical`)
    assert.deepEqual(openGraph(html), [], `${page.route} has no OpenGraph metadata like baseline`)
    assert.deepEqual(twitter(html), [], `${page.route} has no Twitter metadata like baseline`)
  }
})

test('preview build environment never leaks into feed, sitemap, robots or canonical URLs', async () => {
  const previewOrigin = 'https://preview.rinae.pages.dev'
  const build = spawnSync('pnpm', ['build'], {
    cwd: repositoryRoot,
    encoding: 'utf8',
    timeout: 300_000,
    env: {
      ...process.env,
      NEXT_PUBLIC_SITE_URL: previewOrigin,
      PUBLIC_SITE_URL: previewOrigin,
      SITE_URL: previewOrigin,
      CF_PAGES_URL: previewOrigin,
    },
  })
  assert.equal(
    build.status,
    0,
    `preview-condition Astro build failed (exit ${build.status}):\n${build.stdout}\n${build.stderr}`
  )

  const [rss, sitemap, robots] = await Promise.all([
    artifact('rss.xml'),
    artifact('sitemap.xml'),
    artifact('robots.txt'),
  ])
  for (const [label, contents] of [
    ['rss.xml', rss],
    ['sitemap.xml', sitemap],
    ['robots.txt', robots],
  ]) {
    assert.ok(!contents.includes(previewOrigin), `${label} must not contain the preview origin`)
  }
  assert.ok(
    sitemapLocations(sitemap).every((location) => location.startsWith(`${PRODUCTION_ORIGIN}/`)),
    'preview build still emits production sitemap URLs'
  )
  assert.match(robots, /^Sitemap: https:\/\/rinae\.dev\/sitemap\.xml$/m)

  const home = await readFile(path.join(outputRoot, 'index.html'), 'utf8')
  assert.equal(canonical(home), null, 'no canonical tag is introduced by the preview build')
  assert.equal(pageTitle(home), 'rinae.dev')
})
