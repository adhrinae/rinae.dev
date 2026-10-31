import { currentPosts } from './lib/current-posts.mjs'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'

import {
  createCachedAstroBuild,
  decodeHtml,
  decodePath,
  outputRoot,
  repositoryRoot,
} from './lib/astro-test-helpers.mjs'

const buildAstroSite = createCachedAstroBuild('Astro topic-navigation build')

const postRoutes = (html) =>
  [...html.matchAll(/<a\b[^>]*href="(\/posts\/[^"#?]+)"[^>]*>/g)].map(([, href]) =>
    decodePath(href)
  )

const tagListItems = (html) => {
  const match = html.match(/<div class="tag-list[^"]*">([\s\S]*?)<\/div>/)
  assert.ok(match, 'page must expose the full tag list')
  return [...match[1].matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(
    ([, href, label]) => ({
      href: decodePath(href),
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
  const titleLink = `href="/posts/${slug}"`
  const titlePosition = html.indexOf(titleLink)
  assert.notEqual(titlePosition, -1, `${slug} must appear in the public posts list`)
  const rowStart = html.lastIndexOf('<div class="post-row', titlePosition)
  const tagsStart = html.indexOf('<div class="post-tags', titlePosition)
  const nextRow = html.indexOf('<div class="post-row', rowStart + '<div class="post-row'.length)
  assert.ok(tagsStart > titlePosition && (nextRow === -1 || tagsStart < nextRow))
  const tagsEnd = html.indexOf('</div>', tagsStart)
  return [...html.slice(tagsStart, tagsEnd).matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)].map(
    ([, href]) => decodePath(href)
  )
}

const relatedHtml = (html) => {
  const start = html.indexOf('<section class="related-posts"')
  assert.notEqual(start, -1, 'article must expose a related posts section')
  const end = html.indexOf('</section>', start)
  assert.notEqual(end, -1, 'related posts section must close')
  return html.slice(start, end)
}

test('home, list, tags and related posts reflect current content', async () => {
  await buildAstroSite()
  const posts = await currentPosts()
  const routes = (items) => items.map((post) => `/posts/${post.slug}`)
  const counts = new Map()
  for (const post of posts) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  const expectedTags = [...counts].map(([name, count]) => ({
    href: `/tags/${name}`,
    label: `${name} (${count})`,
  }))
  const home = await readFile(path.join(outputRoot, 'index.html'), 'utf8')
  const list = await readFile(path.join(outputRoot, 'posts.html'), 'utf8')
  assert.deepEqual(postRoutes(home), routes(posts.slice(0, 5)))
  assert.deepEqual(postRoutes(list), routes(posts))
  assert.deepEqual(tagListItems(list), expectedTags)

  for (const [tag] of counts) {
    const html = await readFile(path.join(outputRoot, 'tags', `${tag}.html`), 'utf8')
    assert.deepEqual(postRoutes(html), routes(posts.filter((post) => post.tags.includes(tag))))
    assert.deepEqual(tagListItems(html), expectedTags)
  }
  for (const post of posts) {
    assert.deepEqual(
      postTagRoutes(list, post.slug),
      post.tags.map((tag) => `/tags/${tag}`)
    )
    const html = await readFile(path.join(outputRoot, 'posts', `${post.slug}.html`), 'utf8')
    const related = relatedHtml(html)
    assert.match(related, /aria-label="관련 글"/)
    const expected = posts
      .filter(
        (candidate) =>
          candidate.title !== post.title && candidate.tags.some((tag) => post.tags.includes(tag))
      )
      .slice(0, 5)
    assert.deepEqual(postRoutes(related), routes(expected))
  }
})
