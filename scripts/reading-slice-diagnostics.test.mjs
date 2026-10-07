import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const invalidMarkdown = (frontmatter, body) => `---\n${frontmatter}\n---\n\n${body}\n`

const assertBuildDiagnostic = async (testContext, filename, source, field) => {
  const invalidFile = path.join(repositoryRoot, 'fixtures/content', filename)
  await writeFile(invalidFile, source)

  let build
  try {
    build = spawnSync('pnpm', ['build'], {
      cwd: repositoryRoot,
      encoding: 'utf8',
      timeout: 300_000,
    })
  } finally {
    await rm(invalidFile, { force: true })
  }

  const output = `${build.stdout}\n${build.stderr}`
  assert.notEqual(build.status, 0, `Astro unexpectedly accepted ${filename}`)
  assert.ok(output.includes(filename), output)
  assert.match(output, new RegExp(field, 'i'))
  testContext.diagnostic(output.trim())
}

test('Astro build reports the source file and missing title field for malformed Markdown', async (t) => {
  await assertBuildDiagnostic(
    t,
    `diagnostic-missing-title-${process.pid}.mdx`,
    invalidMarkdown(
      "date: '2025-01-02'\nslug: diagnostic-missing-title\ntags:\n  - Synthetic",
      'A malformed diagnostic fixture.'
    ),
    'title'
  )
})

test('Astro build rejects impossible calendar dates and names the date field', async (t) => {
  await assertBuildDiagnostic(
    t,
    `diagnostic-impossible-date-${process.pid}.mdx`,
    invalidMarkdown(
      "title: 'Invalid date'\ndate: '2024-02-30'\nslug: diagnostic-impossible-date\ntags:\n  - Synthetic",
      'An impossible date fixture.'
    ),
    'date'
  )
})

test('Astro build reports a wrong title type with the source file and field', async (t) => {
  await assertBuildDiagnostic(
    t,
    `diagnostic-wrong-title-type-${process.pid}.mdx`,
    invalidMarkdown(
      "title: []\ndate: '2025-01-02'\nslug: diagnostic-wrong-title-type\ntags:\n  - Synthetic",
      'A wrong-type diagnostic fixture.'
    ),
    'title'
  )
})

test('Astro build reports both sources for a duplicate synthetic public path', async (t) => {
  const firstName = `diagnostic-collision-first-${process.pid}.md`
  const secondName = `diagnostic-collision-second-${process.pid}.md`
  const routeSlug = `duplicate-fixture-${process.pid}`
  const firstFile = path.join(repositoryRoot, 'fixtures/content', firstName)
  const secondFile = path.join(repositoryRoot, 'fixtures/content', secondName)
  const frontmatter = `title: 'Collision fixture'\ndate: '2025-01-02'\nslug: ${routeSlug}\ntags:\n  - Synthetic`
  const source = invalidMarkdown(frontmatter, 'A duplicate route fixture.')

  await Promise.all([writeFile(firstFile, source), writeFile(secondFile, source)])
  let build
  try {
    build = spawnSync('pnpm', ['build'], {
      cwd: repositoryRoot,
      encoding: 'utf8',
      timeout: 300_000,
    })
  } finally {
    await Promise.all([rm(firstFile, { force: true }), rm(secondFile, { force: true })])
  }

  const output = `${build.stdout}\n${build.stderr}`
  assert.notEqual(build.status, 0, 'Astro unexpectedly accepted duplicate public paths')
  assert.ok(output.includes(firstName), output)
  assert.ok(output.includes(secondName), output)
  assert.ok(output.includes(`/preview/${routeSlug}`), output)
  assert.match(output, /public path collision/i)
  t.diagnostic(output.trim())
})

test('Astro build rejects a slug that normalizes onto the home route', async (t) => {
  const filename = `diagnostic-reserved-route-${process.pid}.md`
  const fixture = path.join(repositoryRoot, 'fixtures/content', filename)
  const source = invalidMarkdown(
    "title: 'Reserved route fixture'\ndate: '2025-01-02'\nslug: '..'\ntags:\n  - Synthetic",
    'A reserved route diagnostic fixture.'
  )

  await writeFile(fixture, source)
  let build
  try {
    build = spawnSync('pnpm', ['build'], {
      cwd: repositoryRoot,
      encoding: 'utf8',
      timeout: 300_000,
    })
  } finally {
    await rm(fixture, { force: true })
  }

  const output = `${build.stdout}\n${build.stderr}`
  assert.notEqual(build.status, 0, 'Astro unexpectedly accepted a route that shadows home')
  assert.ok(output.includes('diagnostic-reserved-route-'), output)
  assert.ok(output.toLowerCase().includes('reserved public path collision at /'), output)
  t.diagnostic(output.trim())
})

test('Astro build reports both sources for a duplicate post public path', async (t) => {
  const slug = `diagnostic-post-collision-${process.pid}`
  const firstName = `${slug}-first.mdx`
  const secondName = `${slug}-second.mdx`
  const firstFile = path.join(repositoryRoot, 'content/posts', firstName)
  const secondFile = path.join(repositoryRoot, 'content/posts', secondName)
  const frontmatter = `title: 'Post collision fixture'\ndate: '2025-01-02'\nslug: ${slug}\ntags:\n  - Synthetic`
  const source = invalidMarkdown(frontmatter, 'A duplicate post route fixture.')

  await Promise.all([writeFile(firstFile, source), writeFile(secondFile, source)])
  let build
  try {
    build = spawnSync('pnpm', ['build'], {
      cwd: repositoryRoot,
      encoding: 'utf8',
      timeout: 300_000,
    })
  } finally {
    await Promise.all([rm(firstFile, { force: true }), rm(secondFile, { force: true })])
  }

  const output = `${build.stdout}\n${build.stderr}`
  assert.notEqual(build.status, 0, 'Astro unexpectedly accepted duplicate post public paths')
  assert.ok(output.includes(firstName), output)
  assert.ok(output.includes(secondName), output)
  assert.ok(output.includes(`/posts/${slug}`), output)
  assert.match(output, /public path collision/i)
  t.diagnostic(output.trim())
})
