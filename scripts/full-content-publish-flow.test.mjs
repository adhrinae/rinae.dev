import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { access, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = path.join(repositoryRoot, 'astro-dist')

const buildAstroSite = (label) => {
  const build = spawnSync('pnpm', ['astro:build'], {
    cwd: repositoryRoot,
    encoding: 'utf8',
    timeout: 300_000,
  })

  assert.equal(
    build.status,
    0,
    `${label} failed (exit ${build.status}):\n${build.stdout}\n${build.stderr}`
  )
  return build
}

test('a new Markdown post flows through build, list, tag, detail, and the Pagefind index', async () => {
  const slug = `ticket09-publish-flow-${process.pid}`
  const filename = `${slug}.md`
  const sourcePath = path.join(repositoryRoot, 'content/posts', filename)
  const pagefindEntryPath = path.join(outputRoot, '_pagefind/pagefind-entry.json')
  const source = `---
title: '발행 흐름 검증 글'
date: '2099-01-01'
slug: ${slug}
tags:
  - Ticket09 Verification
enableComment: false
---

## 발행 흐름 확인

이 글은 발행 흐름 자동 검증용이며 저장소에 남지 않습니다.
`

  await writeFile(sourcePath, source)
  try {
    buildAstroSite('Astro build with the new Markdown post')

    const detail = await readFile(path.join(outputRoot, 'posts', `${slug}.html`), 'utf8')
    assert.match(detail, /<h1\b[^>]*>발행 흐름 검증 글<\/h1>/)
    assert.match(detail, /id="발행-흐름-확인"/)
    assert.match(detail, /data-pagefind-body/)
    assert.ok(!detail.includes('giscus.app/client.js'), 'enableComment false must not load Giscus')

    const list = await readFile(path.join(outputRoot, 'posts.html'), 'utf8')
    const firstPost = list.match(/<a href="\/posts\/([^"]+)">/)?.[1]
    assert.equal(firstPost, slug, 'the newest post is listed first')

    await access(path.join(outputRoot, 'tags', 'Ticket09 Verification.html'))

    const entry = JSON.parse(await readFile(pagefindEntryPath, 'utf8'))
    assert.ok(
      entry.languages.ko.page_count >= 121,
      `expected the temporary post to be indexed (page_count=${entry.languages.ko.page_count})`
    )
  } finally {
    await rm(sourcePath, { force: true })
    buildAstroSite('clean Astro rebuild after removing the temporary post')
  }

  await assert.rejects(access(path.join(outputRoot, 'posts', `${slug}.html`)))
  const entry = JSON.parse(await readFile(pagefindEntryPath, 'utf8'))
  assert.equal(
    entry.languages.ko.page_count,
    120,
    'the temporary post must not remain in the production Pagefind index'
  )
})
