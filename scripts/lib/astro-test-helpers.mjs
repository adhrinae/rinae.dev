import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

export const outputRoot = path.join(repositoryRoot, 'astro-dist')

export const runAstroBuild = (label = 'Astro build') => {
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

export const createCachedAstroBuild = (label) => {
  let build
  return () => {
    if (!build) build = runAstroBuild(label)
    return build
  }
}

export const decodeHtml = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/gi, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

export const decodePath = (value) => {
  try {
    return decodeURI(value)
  } catch {
    return value
  }
}

export const decodeFragment = (value) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export const renderedHeadings = (html) =>
  [...html.matchAll(/<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/g)].map(
    ([, level, attributes, contents]) => ({
      level: Number(level),
      id: attributes.match(/\bid="([^"]*)"/)?.[1] ?? null,
      text: decodeHtml(contents.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ')).trim(),
    })
  )

export const hrefs = (html) =>
  [...html.matchAll(/<a\b[^>]*href="([^"]*)"/g)].map(([, href]) => href)
