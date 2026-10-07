import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = path.join(repositoryRoot, 'dist')
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
    `Astro build failed (exit ${buildResult.status}):\n${buildResult.stdout}\n${buildResult.stderr}`
  )
}

const parseAttributes = (source) => {
  const attributes = new Map()
  for (const [, name, value] of source.matchAll(/\s+([^\s=/>]+)(?:="([^"]*)")?/g)) {
    attributes.set(name, value ?? '')
  }
  return attributes
}

const scriptTags = (html) =>
  [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].map(([, attributes, body]) => ({
    attributes: parseAttributes(attributes),
    body,
  }))

const stylesheets = async (html) => {
  const urls = [...html.matchAll(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/g)].map(([, url]) => url)
  return Promise.all(
    urls.map((url) => readFile(path.join(outputRoot, url.replace(/^\//, '')), 'utf8'))
  )
}

test('static pages preserve the system-backed theme contract without a React island', async () => {
  await buildAstroSite()

  for (const route of [
    'index.html',
    'posts.html',
    'posts/review-when-to-usememo-and-usecallback.html',
  ]) {
    const html = await readFile(path.join(outputRoot, route), 'utf8')
    const themeBootstraps = scriptTags(html).filter(
      ({ attributes }) => attributes.get('id') === 'theme-bootstrap'
    )
    assert.equal(themeBootstraps.length, 1, `${route} must bootstrap theme exactly once`)
    assert.ok(
      html.indexOf('<script id="theme-bootstrap"') < html.indexOf('</head>'),
      `${route} must resolve the stored/system theme before body content`
    )
    assert.match(html, /<button\b[^>]*data-theme-toggle[^>]*aria-label="Toggle Dark Mode"/)
    assert.match(html, /class="theme-icon-sun[^"]*"/)
    assert.match(html, /class="theme-icon-moon[^"]*"/)
    assert.doesNotMatch(html, /<astro-island\b/)

    const css = (await stylesheets(html)).join('\n')
    assert.match(css, /\.dark[^,{]*\{[^}]*--reading-background/)
  }

  const assetDirectory = path.join(outputRoot, '_astro')
  const assets = await readdir(assetDirectory)
  const scripts = await Promise.all(
    assets
      .filter((name) => name.endsWith('.js'))
      .map((name) => readFile(path.join(assetDirectory, name), 'utf8'))
  )
  assert.doesNotMatch(scripts.join('\n'), /react-dom(?:\/client)?|@giscus\/react|ReactDOM/)
})
