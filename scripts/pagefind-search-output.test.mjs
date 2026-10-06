import assert from 'node:assert/strict'
import { access, readFile, readdir } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = path.join(repositoryRoot, 'dist')
const pagefindRoot = path.join(outputRoot, '_pagefind')
let buildResult

const buildAstroSite = async () => {
  if (!buildResult) {
    buildResult = spawnSync('pnpm', ['build'], {
      cwd: repositoryRoot,
      encoding: 'utf8',
      timeout: 90_000,
    })
  }

  assert.equal(
    buildResult.status,
    0,
    `Astro and Pagefind build failed (exit ${buildResult.status}):\n${buildResult.stdout}\n${buildResult.stderr}`
  )
}

const readOutputPage = (route) => readFile(path.join(outputRoot, route), 'utf8')
const countMatches = (value, pattern) => [...value.matchAll(pattern)].length

test('Astro build emits the pinned Pagefind index and Component UI assets', async () => {
  await buildAstroSite()

  const files = await readdir(pagefindRoot)
  for (const file of [
    'pagefind-entry.json',
    'pagefind.js',
    'pagefind-component-ui.js',
    'pagefind-component-ui.css',
  ]) {
    assert.ok(files.includes(file), `missing generated Pagefind asset: ${file}`)
    await access(path.join(pagefindRoot, file))
  }

  await access(path.join(outputRoot, 'favicon.svg'))

  const entry = JSON.parse(await readFile(path.join(pagefindRoot, 'pagefind-entry.json'), 'utf8'))
  assert.equal(entry.version, '1.5.2')
  assert.ok(entry.languages.ko?.page_count > 0, 'the generated index must contain Korean pages')
})

test('static pages load the Pagefind searchbox and exclude the synthetic preview from indexing', async () => {
  await buildAstroSite()

  const routes = [
    { output: 'index.html', publicUrl: '/' },
    { output: 'posts.html', publicUrl: '/posts' },
    { output: 'posts/recreating-blog-2025.html', publicUrl: '/posts/recreating-blog-2025' },
    { output: 'tags/Blog.html', publicUrl: '/tags/Blog' },
  ]

  for (const { output, publicUrl } of routes) {
    const html = await readOutputPage(output)
    assert.match(html, /<link rel="icon" type="image\/svg\+xml" href="\/favicon\.svg">/)
    assert.match(
      html,
      /<pagefind-config\b[^>]*bundle-path="\/_pagefind\/"[^>]*lang="ko"/,
      `${output} must configure the generated Korean bundle`
    )
    assert.match(html, /<pagefind-searchbox\b/, `${output} must include the searchbox`)
    assert.match(html, /placeholder="글 검색\.\.\."/, `${output} must use the Korean placeholder`)
    assert.match(html, /shortcut="mod\+k"/, `${output} must expose the platform search shortcut`)
    assert.match(html, /href="\/_pagefind\/pagefind-component-ui\.css"/)
    assert.match(html, /src="\/_pagefind\/pagefind-component-ui\.js"/)
    assert.ok(
      html.includes(`<meta data-pagefind-meta="url:${publicUrl}">`),
      `${output} must preserve its extensionless public route in search results`
    )
    assert.doesNotMatch(
      html,
      /<astro-island\b/,
      `${output} must not hydrate a React island for search`
    )
    assert.equal(countMatches(html, /<pagefind-searchbox\b/g), 1)
    assert.equal(countMatches(html, /pagefind-component-ui\.js/g), 1)
  }

  const preview = await readOutputPage('preview/markdown-heading-fixture.html')
  assert.doesNotMatch(preview, /data-pagefind-body/, 'synthetic parser fixtures are not indexed')
})

test('the generated Korean index covers every public post and tag route', async () => {
  await buildAstroSite()

  const entry = JSON.parse(await readFile(path.join(pagefindRoot, 'pagefind-entry.json'), 'utf8'))
  assert.equal(
    entry.languages.ko.page_count,
    120,
    '86 posts + 31 tags + home + list + colophon, excluding the synthetic preview'
  )

  const postFiles = (await readdir(path.join(outputRoot, 'posts'))).filter((name) =>
    name.endsWith('.html')
  )
  assert.equal(postFiles.length, 86)
  for (const file of postFiles) {
    const html = await readOutputPage(path.join('posts', file))
    assert.match(html, /data-pagefind-body/, `${file} must be indexed`)
  }

  const tagFiles = (await readdir(path.join(outputRoot, 'tags'))).filter((name) =>
    name.endsWith('.html')
  )
  assert.equal(tagFiles.length, 31)
})
