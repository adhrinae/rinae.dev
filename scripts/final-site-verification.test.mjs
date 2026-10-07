import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, readdir, readFile, rm, stat } from 'node:fs/promises'
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

// Both stylesheet contracts must read the same emitted build output and apply the same
// `_pagefind` exclusion.
const readBuiltSiteCss = async () => {
  const siteCssFiles = (await walk(outputRoot, { skip: ['.prerender'] })).filter(
    (file) => file.endsWith('.css') && !file.split(path.sep).includes('_pagefind')
  )
  assert.ok(siteCssFiles.length > 0, 'the build must emit a site stylesheet')
  return (await Promise.all(siteCssFiles.map((file) => readFile(file, 'utf8')))).join('\n')
}

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
  assert.ok(await pathExists(notFoundPath), 'dist/404.html must exist for static 404 responses')

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

  const shippedFiles = await walk(outputRoot, { skip: ['.prerender'] })
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
    // Ticket 15 compiles Tailwind v4 through the Vite plugin, so `tailwindcss` itself is
    // declared again; the PostCSS pipeline and animation preset stay unused.
    '@tailwindcss/postcss',
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
  ]
  for (const removed of removedPaths) {
    assert.ok(!(await pathExists(path.join(repositoryRoot, removed))), `${removed} must be removed`)
  }

  assert.ok(!(await pathExists(path.join(outputRoot, '_next'))), 'dist must not contain /_next/')

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

test('every public page keeps the baseline discovery links to the colophon and the RSS feed', async () => {
  await buildAstroSite()

  for (const file of ['index.html', 'posts/recreating-blog-2025.html', 'tags/Programming.html']) {
    const html = await readFile(path.join(outputRoot, file), 'utf8')
    assert.ok(html.includes('href="/colophon"'), `${file} must link to the colophon`)
    assert.ok(html.includes('href="/rss.xml"'), `${file} must link to the RSS feed`)
  }
})

test('post lists keep the baseline tag icon and the home page keeps the view-all arrow', async () => {
  await buildAstroSite()

  const tagIconPath = 'M7 10h-.01'
  for (const file of ['index.html', 'posts.html', 'tags/Programming.html']) {
    const html = await readFile(path.join(outputRoot, file), 'utf8')
    assert.ok(html.includes(tagIconPath), `${file} must render the baseline tag icon`)
  }

  const arrowPath = 'M15 8l4 4'
  const home = await readFile(path.join(outputRoot, 'index.html'), 'utf8')
  assert.ok(home.includes(arrowPath), 'index.html must render the baseline view-all arrow')
  assert.ok(home.includes('모든 글 보기'), 'index.html must keep the view-all label')
})

// The deployment build must not ship the synthetic /preview fixture route (`pnpm test` sets
// MARKDOWN_FIXTURES=1 for the reading-slice assertions; Cloudflare runs `pnpm build` without
// it). This builds into its own scratch directory so it neither depends on nor disturbs the
// shared test build output: test files are not guaranteed to run in the order listed.
test('the deployment build ships no synthetic /preview fixture route', async () => {
  // Astro renames prerendered assets into the output directory, so the scratch build has to
  // share a filesystem with the repository (`/tmp` fails with EXDEV on this machine).
  const scratchParent = path.join(repositoryRoot, 'node_modules', '.cache')
  await mkdir(scratchParent, { recursive: true })
  const scratchRoot = await mkdtemp(path.join(scratchParent, 'rinae-deploy-check-'))

  try {
    const build = spawnSync(
      'pnpm',
      ['exec', 'astro', 'build', '--root', './astro', '--outDir', scratchRoot],
      {
        cwd: repositoryRoot,
        encoding: 'utf8',
        timeout: 300_000,
        env: { ...process.env, MARKDOWN_FIXTURES: '' },
      }
    )
    assert.equal(
      build.status,
      0,
      `deployment-environment build failed (exit ${build.status}):\n${build.stdout}\n${build.stderr}`
    )

    assert.ok(
      await pathExists(path.join(scratchRoot, 'index.html')),
      'the deployment build must render index.html'
    )
    assert.ok(
      await pathExists(path.join(scratchRoot, '404.html')),
      'the deployment build must render 404.html'
    )

    const renderedFiles = (await walk(scratchRoot)).filter((file) => file.endsWith('.html'))
    assert.ok(
      renderedFiles.length >= 121,
      `expected the full site to build, got ${renderedFiles.length} HTML files`
    )
    assert.equal(
      renderedFiles.filter((file) => file.split(path.sep).includes('preview')).length,
      0,
      'no synthetic preview fixture pages may ship in a deployment build'
    )
  } finally {
    await rm(scratchRoot, { recursive: true, force: true })
  }
})

test('the site compiles its own Tailwind v4 stylesheet instead of shipping the Nextra bundle', async () => {
  await buildAstroSite()

  const manifest = await readPackageManifest()
  const declared = { ...manifest.dependencies, ...manifest.devDependencies }
  for (const dependency of ['@tailwindcss/vite', '@tailwindcss/typography', 'tailwindcss']) {
    assert.ok(declared[dependency], `package.json must declare ${dependency}`)
  }

  const styleSources = await readdir(path.join(repositoryRoot, 'astro', 'src', 'styles'))
  assert.deepEqual(
    styleSources,
    ['site.css'],
    'astro/src/styles must hold exactly one stylesheet source that reading.css is absorbed into'
  )

  const css = await readBuiltSiteCss()
  assert.ok(!/\.nextra-|--x-color-nextra-bg|twoslash/.test(css), 'the Nextra bundle must not ship')
  assert.ok(css.includes('.prose'), 'the typography utility must be compiled')
  assert.ok(css.includes('max-w-\\[43\\.75rem\\]'), 'the reading column utility must be compiled')

  const html = await readFile(path.join(outputRoot, 'index.html'), 'utf8')
  assert.ok(
    html.includes('prose') && html.includes('max-w-[43.75rem]'),
    'the semantic page markup must keep using the compiled utilities'
  )
})

test('the static site opts into native cross-document view transitions without a client router', async () => {
  await buildAstroSite()

  const css = await readBuiltSiteCss()

  assert.match(
    css,
    /@view-transition\s*\{\s*navigation:\s*auto\s*\}/,
    'the global stylesheet must enable native cross-document view transitions'
  )
  assert.match(
    css,
    /@media \(prefers-reduced-motion:\s*reduce\)\{[^}]*::view-transition-old\(\*\)[^{]*\{animation:\s*none/,
    'the view-transition animations must be suppressed for prefers-reduced-motion'
  )

  // No client router means no cross-document swap hooks that would force script re-initialization.
  const routerMarkers = ['astro-transition', 'astro:page-load', 'astro:after-swap']
  const htmlFiles = (await walk(outputRoot, { skip: ['.prerender'] })).filter((file) =>
    file.endsWith('.html')
  )
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8')
    for (const marker of routerMarkers) {
      assert.ok(
        !html.includes(marker),
        `${path.relative(repositoryRoot, file)} ships the client-router marker ${marker}`
      )
    }
  }
})
