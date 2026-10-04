import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, test } from 'node:test'
import { collectBaseline } from './collect-site-baseline.mjs'

const temporaryDirectories = []

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'site-baseline-test-'))
  temporaryDirectories.push(root)
  const siteDir = path.join(root, 'site')
  const contentDir = path.join(root, 'content')
  await mkdir(path.join(siteDir, 'posts'), { recursive: true })
  await mkdir(path.join(contentDir, 'posts'), { recursive: true })
  return { root, siteDir, contentDir }
}

async function writeFixture(directory, relativePath, contents) {
  const filePath = path.join(directory, relativePath)
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, contents)
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true }))
  )
})

test('collects rendered routes, metadata, heading IDs, internal links, and local assets', async () => {
  const { siteDir, contentDir } = await fixture()
  await writeFixture(
    siteDir,
    'index.html',
    `<!doctype html><html><head>
    <title>Home</title><meta name="description" content="Home description">
    <link rel="canonical" href="https://example.test/"><script src="/app.js"></script>
  </head><body><main style="background-image: url('/inline.png')"><h1 id="home">Home</h1><a href="/posts/one#body">Read post</a>
    <a href="/posts/two">Second post</a><img src="/cover.png" alt="Cover"></main></body></html>`
  )
  await writeFixture(
    siteDir,
    'posts/one.html',
    `<!doctype html><html><head><title>One</title></head>
    <body><main><h1 id="title">One</h1><h2 id="body">Example</h2></main></body></html>`
  )
  await writeFixture(
    siteDir,
    'posts/two.html',
    '<!doctype html><html><body><h1>Two</h1></body></html>'
  )
  await writeFixture(
    siteDir,
    'posts/related.html',
    '<!doctype html><html><body><article data-pagefind-body><h2>관련 글</h2><ul><li><a href="/posts/one">One</a></li><li><a href="/posts/two">Two</a></li></ul></article></body></html>'
  )
  await writeFixture(siteDir, 'cover.png', 'asset')
  await writeFixture(siteDir, 'inline.png', 'asset')
  await writeFixture(siteDir, 'app.js', 'console.log("baseline")')
  await writeFixture(
    contentDir,
    'posts/one.mdx',
    `---\ntitle: One\ndate: 2024-01-02\ntags: [Testing]\nenableComment: false\nslug: one\n---\nBody`
  )

  const result = await collectBaseline({ siteDir, contentDir, origin: 'https://example.test' })
  assert.deepEqual(
    result.routes.map((page) => page.route),
    ['/', '/posts/one', '/posts/related', '/posts/two']
  )

  const home = result.pages.find((page) => page.route === '/')
  assert.equal(home.metadata.title, 'Home')
  assert.equal(home.metadata.description, 'Home description')
  assert.equal(home.metadata.canonical, 'https://example.test/')
  assert.deepEqual(home.headings, [{ level: 1, id: 'home', text: 'Home' }])
  assert.ok(
    home.internalLinks.some(
      (link) =>
        link.href === '/posts/one#body' &&
        link.targetRoute === '/posts/one' &&
        link.fragment === 'body'
    )
  )
  assert.deepEqual(home.contentPostRoutes, ['/posts/one', '/posts/two'])
  assert.deepEqual(result.pages.find((page) => page.route === '/posts/related').relatedPostRoutes, [
    '/posts/one',
    '/posts/two',
  ])
  assert.ok(home.assets.some((asset) => asset.url === '/cover.png' && asset.exists))
  assert.ok(
    home.assets.some(
      (asset) => asset.tagName === 'script' && asset.url === '/app.js' && asset.exists
    )
  )
  assert.equal(home.counts.images, 1)
  assert.ok(
    result.cssReferences.some(
      (reference) => reference.url === '/inline.png' && reference.internal && reference.exists
    )
  )
  assert.deepEqual(result.frontmatter.fieldCounts.description, {
    present: 0,
    absent: 1,
    valueTypes: {},
  })
})

test('reports duplicate IDs and unresolved routes, anchors, and local assets without hiding them', async () => {
  const { siteDir, contentDir } = await fixture()
  await writeFixture(
    siteDir,
    'index.html',
    `<!doctype html><html><body><main>
    <h1 id="repeat">First</h1><h2 id="repeat">Second</h2>
    <a href="/posts/missing#nowhere">Missing page</a><a href="#nowhere">Missing local anchor</a>
    <a href="/posts/one#not-here">Missing cross-page anchor</a><img src="/missing.png" alt="Missing">
  </main></body></html>`
  )
  await writeFixture(
    siteDir,
    'posts/one.html',
    '<!doctype html><html><body><h1 id="present">One</h1></body></html>'
  )
  await writeFixture(
    contentDir,
    'posts/one.mdx',
    `---\ntitle: One\ndate: 2024-01-02\ntags: []\nenableComment: false\nslug: one\n---\nBody`
  )

  const result = await collectBaseline({ siteDir, contentDir, origin: 'https://example.test' })
  const codes = result.findings.map((finding) => finding.code)
  assert.ok(codes.includes('duplicate-id'))
  assert.ok(codes.includes('missing-route'))
  assert.ok(codes.includes('missing-anchor'))
  assert.ok(
    result.findings.some(
      (finding) => finding.code === 'missing-anchor' && finding.target === '/posts/one#not-here'
    )
  )
  assert.ok(codes.includes('missing-asset'))
})

test('follows local stylesheet URLs and reports missing CSS assets', async () => {
  const { siteDir, contentDir } = await fixture()
  await writeFixture(
    siteDir,
    'index.html',
    '<!doctype html><html><head><link rel="stylesheet" href="/styles/site.css"></head><body></body></html>'
  )
  await writeFixture(
    siteDir,
    'styles/site.css',
    'body { background-image: url("../images/missing.svg"); }'
  )
  await writeFixture(
    contentDir,
    'posts/one.mdx',
    `---\\ntitle: One\\ndate: 2024-01-02\\ntags: []\\nenableComment: false\\nslug: one\\n---\\nBody`
  )

  const result = await collectBaseline({ siteDir, contentDir, origin: 'https://example.test' })
  assert.ok(
    result.cssReferences.some(
      (reference) =>
        reference.url === '../images/missing.svg' && reference.internal && !reference.exists
    )
  )
  assert.ok(
    result.findings.some(
      (finding) => finding.code === 'missing-asset' && finding.source === 'styles/site.css'
    )
  )
})

test('does not treat an encoded slash as a route separator when resolving internal links', async () => {
  const { siteDir, contentDir } = await fixture()
  await writeFixture(
    siteDir,
    'index.html',
    '<!doctype html><html><body><a href="/posts/Web%2FFundamental">Encoded tag path</a></body></html>'
  )
  await writeFixture(
    siteDir,
    'posts/Web/Fundamental.html',
    '<!doctype html><html><body><h1>Nested route</h1></body></html>'
  )

  const result = await collectBaseline({ siteDir, contentDir, origin: 'https://example.test' })
  const home = result.pages.find((page) => page.route === '/')
  assert.equal(home.internalLinks[0].exists, false)
  assert.ok(
    result.findings.some(
      (finding) => finding.code === 'missing-route' && finding.target === '/posts/Web%2FFundamental'
    )
  )
})

test('censuses optional description and flags invalid dates and duplicate normalized slugs', async () => {
  const { siteDir, contentDir } = await fixture()
  await writeFixture(siteDir, 'index.html', '<!doctype html><html><body></body></html>')
  await writeFixture(
    contentDir,
    'posts/one.mdx',
    `---\ntitle: One\ndate: 2024-01-02\ntags: [Testing]\nenableComment: false\nslug: same\n---\nBody`
  )
  await writeFixture(
    contentDir,
    'posts/two.mdx',
    `---\ntitle: Two\ndate: not-a-date\ntags: [Testing]\nenableComment: true\nslug: /same/\ndescription: Optional\n---\nBody`
  )
  await writeFixture(contentDir, 'posts/index.mdx', '# Post index without metadata')

  const result = await collectBaseline({ siteDir, contentDir, origin: 'https://example.test' })
  assert.deepEqual(result.frontmatter.fieldCounts.description, {
    present: 1,
    absent: 1,
    valueTypes: { string: 1 },
  })
  assert.equal(result.frontmatter.observedOnAllPosts.includes('description'), false)
  assert.deepEqual(result.frontmatter.observedOnAllPosts, [
    'date',
    'enableComment',
    'slug',
    'tags',
    'title',
  ])
  assert.ok(
    result.findings.some(
      (finding) => finding.code === 'invalid-date' && finding.source.endsWith('two.mdx')
    )
  )
  assert.ok(result.findings.some((finding) => finding.code === 'duplicate-slug'))
  assert.ok(
    result.findings.some(
      (finding) =>
        finding.code === 'slug-rendered-route-mismatch' && finding.source === 'posts/two.mdx'
    )
  )
  assert.equal(
    result.frontmatter.fixedOrIndexPages.find((page) => page.source === 'posts/index.mdx')
      .frontmatterStatus,
    'not-present-index-document'
  )
  assert.equal(
    result.findings.some((finding) => finding.source === 'posts/index.mdx'),
    false
  )
})

// Approved regression seams: executable CLI and collected related-route inventory.
test('both CLIs execute through a symlinked absolute path rather than silently succeeding', async () => {
  const { symlink } = await import('node:fs/promises')
  const { spawnSync } = await import('node:child_process')
  const { fileURLToPath } = await import('node:url')
  const { root } = await fixture()
  for (const name of ['collect-site-baseline.mjs', 'compare-site-baseline.mjs']) {
    const alias = path.join(root, name)
    await symlink(fileURLToPath(new URL(name, import.meta.url)), alias)
    const result = spawnSync(process.execPath, [alias, '--help'], { encoding: 'utf8' })
    assert.equal(result.status, 0, result.stderr)
    assert.match(result.stdout, /Usage: node scripts\//)
  }
})

test('preserves a related self-link so comparison detects its introduction', async () => {
  const { compareBaselines } = await import('./compare-site-baseline.mjs')
  const { siteDir, contentDir } = await fixture()
  const html = '<article data-pagefind-body><h2>관련 글</h2><ul>LINK</ul></article>'
  await writeFixture(siteDir, 'posts/one.html', html.replace('LINK', ''))
  const before = await collectBaseline({ siteDir, contentDir })
  await writeFixture(
    siteDir,
    'posts/one.html',
    html.replace('LINK', '<li><a href="/posts/one">One</a></li>')
  )
  const after = await collectBaseline({ siteDir, contentDir })
  assert.deepEqual(after.pages[0].relatedPostRoutes, ['/posts/one'])
  assert.ok(
    compareBaselines(before, after).changes.some((change) =>
      change.path.includes('relatedPostRoutes')
    )
  )
})
