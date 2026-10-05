import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
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
      timeout: 90_000,
    })
  }

  assert.equal(
    buildResult.status,
    0,
    `Astro build failed (exit ${buildResult.status}):\n${buildResult.stdout}\n${buildResult.stderr}`
  )
}

const decodeHtml = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/gi, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const postRoutes = (html) =>
  [...html.matchAll(/<a\b[^>]*href="(\/posts\/[^"#?]+)"[^>]*>/g)].map(([, href]) => href)

const tagListHtml = (html) => {
  const match = html.match(/<div class="tag-list">([\s\S]*?)<\/div>/)
  assert.ok(match, 'tag page must expose the full tag list')
  return match[1]
}

const tagListItems = (html) =>
  [...tagListHtml(html).matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(
    ([, href, label]) => ({ href, label: decodeHtml(label.replace(/<[^>]+>/g, '').trim()) })
  )

const postTagRoutes = (html, slug) => {
  const titleLink = `<a href="/posts/${slug}">`
  const titlePosition = html.indexOf(titleLink)
  assert.notEqual(titlePosition, -1, `${slug} must appear in the public posts list`)
  const rowStart = html.lastIndexOf('<div class="post-row">', titlePosition)
  const tagsStart = html.indexOf('<div class="post-tags">', titlePosition)
  const nextRow = html.indexOf('<div class="post-row">', rowStart + '<div class="post-row">'.length)
  assert.ok(tagsStart > titlePosition && (nextRow === -1 || tagsStart < nextRow))
  const tagsEnd = html.indexOf('</div>', tagsStart)
  const tags = html.slice(tagsStart, tagsEnd)
  return [...tags.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)].map(([, href]) => href)
}

const relatedHtml = (html) => {
  const start = html.indexOf('<section class="related-posts"')
  assert.notEqual(start, -1, 'article must expose a related posts section')
  const end = html.indexOf('</section>', start)
  assert.notEqual(end, -1, 'related posts section must close')
  return html.slice(start, end)
}

const expectedTagPages = {
  AI: ['/posts/recreating-blog-2025'],
  Blog: ['/posts/recreating-blog-2025'],
  Learning: ['/posts/recreating-blog-2025', '/posts/understanding-taming-the-meta-language-kor'],
  Translation: [
    '/posts/a-complete-guide-to-useeffect-ko',
    '/posts/understanding-taming-the-meta-language-kor',
  ],
  React: [
    '/posts/a-complete-guide-to-useeffect-ko',
    '/posts/review-when-to-usememo-and-usecallback',
  ],
  Programming: [
    '/posts/review-when-to-usememo-and-usecallback',
    '/posts/understanding-taming-the-meta-language-kor',
  ],
  Reading: ['/posts/the-fine-art-of-fast-development-kr-1'],
  Agile: ['/posts/the-fine-art-of-fast-development-kr-1'],
}

const expectedTagCounts = [
  ['AI', 1],
  ['Blog', 1],
  ['Learning', 2],
  ['Translation', 2],
  ['React', 2],
  ['Programming', 2],
  ['Reading', 1],
  ['Agile', 1],
]

const expectedPostTags = {
  'recreating-blog-2025': ['AI', 'Blog', 'Learning'],
  'a-complete-guide-to-useeffect-ko': ['Translation', 'React'],
  'review-when-to-usememo-and-usecallback': ['React', 'Programming'],
  'the-fine-art-of-fast-development-kr-1': ['Reading', 'Agile'],
  'understanding-taming-the-meta-language-kor': ['Programming', 'Learning', 'Translation'],
}

const expectedRelatedRoutes = {
  'recreating-blog-2025': ['/posts/understanding-taming-the-meta-language-kor'],
  'a-complete-guide-to-useeffect-ko': [
    '/posts/review-when-to-usememo-and-usecallback',
    '/posts/understanding-taming-the-meta-language-kor',
  ],
  'review-when-to-usememo-and-usecallback': [
    '/posts/a-complete-guide-to-useeffect-ko',
    '/posts/understanding-taming-the-meta-language-kor',
  ],
  'the-fine-art-of-fast-development-kr-1': [],
  'understanding-taming-the-meta-language-kor': [
    '/posts/recreating-blog-2025',
    '/posts/a-complete-guide-to-useeffect-ko',
    '/posts/review-when-to-usememo-and-usecallback',
  ],
}

test('generated tag routes preserve tag links, exact matching posts, and date-descending order', async () => {
  await buildAstroSite()

  for (const [tag, expectedRoutes] of Object.entries(expectedTagPages)) {
    const html = await readFile(path.join(outputRoot, 'tags', `${tag}.html`), 'utf8')
    assert.match(html, new RegExp(`<h1>Posts Tagged with &quot;${tag}&quot;<\\/h1>`))
    assert.deepEqual(
      postRoutes(html),
      expectedRoutes,
      `${tag} posts should match the baseline subset`
    )

    const items = tagListItems(html)
    assert.deepEqual(
      items.map(({ href, label }) => [href, label]),
      expectedTagCounts.map(([name, count]) => [`/tags/${name}`, `${name} (${count})`]),
      'the More tags list retains canonical links, names, counts, and source order'
    )

    for (const route of expectedRoutes) {
      await access(path.join(outputRoot, `${route.slice(1)}.html`))
    }
  }
})

test('public post-list tag links and article related posts follow baseline selection', async () => {
  await buildAstroSite()

  for (const [slug, tagNames] of Object.entries(expectedPostTags)) {
    const listHtml = await readFile(path.join(outputRoot, 'posts.html'), 'utf8')
    assert.deepEqual(
      postTagRoutes(listHtml, slug),
      tagNames.map((tag) => `/tags/${tag}`),
      `${slug} should link each displayed tag to its existing public route`
    )

    const html = await readFile(path.join(outputRoot, 'posts', `${slug}.html`), 'utf8')
    const related = relatedHtml(html)
    assert.match(related, /aria-label="관련 글"/)
    assert.match(related, /<h2>관련 글<\/h2>/)
    const actualRoutes = postRoutes(related)
    assert.deepEqual(actualRoutes, expectedRelatedRoutes[slug])
    assert.ok(actualRoutes.length <= 5, 'related posts must never exceed five results')
    assert.equal(actualRoutes.includes(`/posts/${slug}`), false, 'the current article is excluded')

    if (actualRoutes.length === 0) {
      assert.match(
        related,
        /<div class="post-list">\s*<\/div>/,
        'empty results leave a valid empty list'
      )
    }
  }
})
