import assert from 'node:assert/strict'
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'

import { createCachedAstroBuild, outputRoot, repositoryRoot } from './lib/astro-test-helpers.mjs'

const buildAstroSite = createCachedAstroBuild('Astro final-site verification build')

const pathExists = async (target) => {
  try {
    await stat(target)
    return true
  } catch {
    return false
  }
}

const walk = async (directory, { skip = [] } = {}) => {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (skip.includes(entry.name)) continue
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(fullPath, { skip })))
    else files.push(fullPath)
  }
  return files
}

const readPackageManifest = async () =>
  JSON.parse(await readFile(path.join(repositoryRoot, 'package.json'), 'utf8'))

// A hydrated framework runtime would ship these markers; plain DOM scripts must not.
const REACT_RUNTIME_MARKERS =
  /react-dom|react\/jsx-runtime|preact\/hooks|__REACT_DEVTOOLS_GLOBAL_HOOK__|Symbol\.for\(['"]react/i

const inlineScriptBodies = (html) =>
  [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
    .filter(([, attributes]) => !/\bsrc\s*=/.test(attributes))
    .map(([, , body]) => body)

test('the static site ships the baseline 404 error screen outside the search index', async () => {
  await buildAstroSite()

  const notFoundPath = path.join(outputRoot, '404.html')
  assert.ok(
    await pathExists(notFoundPath),
    'astro-dist/404.html must exist for static 404 responses'
  )

  const html = await readFile(notFoundPath, 'utf8')
  assert.match(html, /<title>rinae\.dev<\/title>/)
  assert.match(html, /<h1[^>]*>404<\/h1>/)
  assert.match(html, /This page could not be found\./)
  assert.match(html, /<meta name="robots" content="noindex"/)
  assert.ok(
    !html.includes('data-pagefind-body'),
    'the error screen must not enter the search index'
  )

  const sitemap = await readFile(path.join(outputRoot, 'sitemap.xml'), 'utf8')
  assert.ok(!sitemap.includes('/404'), 'the error screen must not be listed in the sitemap')
})

test('every shipped browser script is runtime-free of React and hydrated islands', async () => {
  await buildAstroSite()

  const shippedFiles = await walk(outputRoot, { skip: ['.prerender', '_pagefind'] })
  const bundleFiles = shippedFiles.filter((file) => file.endsWith('.js'))

  for (const file of bundleFiles) {
    const contents = await readFile(file, 'utf8')
    assert.doesNotMatch(
      contents,
      REACT_RUNTIME_MARKERS,
      `${path.relative(repositoryRoot, file)} ships a React runtime`
    )
  }

  const htmlFiles = shippedFiles.filter((file) => file.endsWith('.html'))
  assert.ok(htmlFiles.length > 0, 'expected rendered HTML in the static output')
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8')
    assert.ok(
      !html.includes('<astro-island'),
      `${path.relative(repositoryRoot, file)} hydrates an island`
    )
    for (const body of inlineScriptBodies(html)) {
      assert.doesNotMatch(
        body,
        REACT_RUNTIME_MARKERS,
        `${path.relative(repositoryRoot, file)} inlines a React runtime`
      )
    }
  }
})

test('no Next.js or Nextra dependency, config, or runtime residue remains', async () => {
  await buildAstroSite()

  const manifest = await readPackageManifest()
  const declared = new Set([
    ...Object.keys(manifest.dependencies ?? {}),
    ...Object.keys(manifest.devDependencies ?? {}),
  ])
  const bannedDependencies = [
    'next',
    'nextra',
    'nextra-theme-blog',
    'next-view-transitions',
    'react',
    'react-dom',
    '@giscus/react',
    '@radix-ui/react-slot',
    '@tabler/icons-react',
    'lucide-react',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    '@types/react',
    '@tailwindcss/postcss',
    'tailwindcss',
    'tw-animate-css',
    'postcss',
  ]
  for (const dependency of bannedDependencies) {
    assert.ok(!declared.has(dependency), `package.json still declares ${dependency}`)
  }

  const removedPaths = [
    'src',
    'next.config.mjs',
    'mdx-components.tsx',
    'components.json',
    'next-env.d.ts',
    'postcss.config.mjs',
    'tsconfig.json',
    'public/_pagefind',
  ]
  for (const removed of removedPaths) {
    assert.ok(!(await pathExists(path.join(repositoryRoot, removed))), `${removed} must be removed`)
  }

  assert.ok(
    !(await pathExists(path.join(outputRoot, '_next'))),
    'astro-dist must not contain /_next/'
  )

  const htmlFiles = (await walk(outputRoot, { skip: ['.prerender'] })).filter((file) =>
    file.endsWith('.html')
  )
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8')
    assert.ok(
      !html.includes('/_next/'),
      `${path.relative(repositoryRoot, file)} references /_next/`
    )
  }
})

test('the shipped Pagefind index is the current 120-page build without a stale copied index', async () => {
  await buildAstroSite()

  assert.ok(
    !(await pathExists(path.join(repositoryRoot, 'public/_pagefind'))),
    'a stale public/_pagefind copy must not be reintroduced into the output'
  )

  const entry = JSON.parse(
    await readFile(path.join(outputRoot, '_pagefind', 'pagefind-entry.json'), 'utf8')
  )
  assert.equal(entry.languages.ko.page_count, 120)

  const version = JSON.parse(
    await readFile(path.join(repositoryRoot, 'node_modules/pagefind/package.json'), 'utf8')
  ).version
  assert.equal(entry.version, version)
})
