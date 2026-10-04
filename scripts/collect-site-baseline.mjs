#!/usr/bin/env node
import { createRequire } from 'node:module'
import { readdir, readFile, realpath, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
const parse5 = require('../node_modules/.pnpm/parse5@7.3.0/node_modules/parse5')
const yaml = require('../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml')
const ASSET_ATTRS = new Set(['src', 'poster', 'data-src'])
const ASSET_LINK_RELS = new Set([
  'stylesheet',
  'icon',
  'shortcut',
  'apple-touch-icon',
  'manifest',
  'preload',
  'modulepreload',
  'mask-icon',
])

async function walkFiles(root) {
  const files = []
  async function visit(directory) {
    let entries
    try {
      entries = await readdir(directory, { withFileTypes: true })
    } catch (error) {
      if (error.code === 'ENOENT') return
      throw error
    }
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const fullPath = path.join(directory, entry.name)
      if (entry.isDirectory()) await visit(fullPath)
      else if (entry.isFile()) files.push(fullPath)
    }
  }
  await visit(root)
  return files
}

function attrs(node) {
  return Object.fromEntries((node.attrs || []).map(({ name, value }) => [name, value]))
}

function textContent(node) {
  if (node.nodeName === '#text') return node.value
  return (node.childNodes || []).map(textContent).join('')
}

function visitTree(node, callback) {
  callback(node)
  for (const child of node.childNodes || []) visitTree(child, callback)
}

function decodePathSegment(segment) {
  return segment
    .split(/(%2f)/i)
    .map((part) => {
      if (/^%2f$/i.test(part)) return '%2F'
      try {
        return decodeURIComponent(part)
      } catch {
        // Keep malformed percent-encoding visible in the recorded path.
        return part
      }
    })
    .join('')
}

function decodePathname(pathname) {
  return pathname.split('/').map(decodePathSegment).join('/')
}

function normalizedRoute(route) {
  let decoded = decodePathname(route)
  if (!decoded.startsWith('/')) decoded = `/${decoded}`
  decoded = decoded.replace(/\/{2,}/g, '/').replace(/\/$/, '')
  return decoded || '/'
}

function htmlFileRoute(siteDir, filePath) {
  const relative = path.relative(siteDir, filePath).split(path.sep).join('/')
  if (relative.startsWith('_next/') || relative.startsWith('_pagefind/')) return null
  if (!relative.endsWith('.html')) return null
  let route = relative.slice(0, -'.html'.length)
  if (route === 'index') route = ''
  else if (route.endsWith('/index')) route = route.slice(0, -'/index'.length)
  return normalizedRoute(`/${route}`)
}

function safeResolveUrl(raw, pageRoute, origin) {
  try {
    const sourceUrl = new URL(pageRoute, `${origin}/`)
    return new URL(raw, sourceUrl)
  } catch {
    return null
  }
}

async function hasFile(siteDir, pathname) {
  const localPath = decodePathname(pathname).replace(/^\/+/, '')
  const resolved = path.resolve(siteDir, localPath)
  if (resolved !== siteDir && !resolved.startsWith(`${siteDir}${path.sep}`)) return false
  try {
    const result = await stat(resolved)
    return result.isFile()
  } catch {
    return false
  }
}

async function localTarget(siteDir, pathname, routeMap) {
  const decodedPath = decodePathname(pathname)
  const route = normalizedRoute(decodedPath)
  if (routeMap.has(route)) return { exists: true, route }
  if (decodedPath.endsWith('.html')) {
    const htmlRoute = normalizedRoute(decodedPath.slice(0, -'.html'.length))
    if (routeMap.has(htmlRoute)) return { exists: true, route: htmlRoute }
  }
  const file = await hasFile(siteDir, pathname)
  return { exists: file, route: null }
}

function parseFrontmatter(source, filePath) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!match) return { data: null, error: 'missing frontmatter block' }
  try {
    const data = yaml.parse(match[1])
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return { data: null, error: 'frontmatter is not a mapping' }
    }
    return { data, error: null }
  } catch (error) {
    return { data: null, error: `${filePath}: ${error.message}` }
  }
}

function valueType(value) {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

function normalizeSlug(slug) {
  if (typeof slug !== 'string') return null
  return normalizedRoute(slug.trim())
}

function addFinding(findings, code, route, source, message, target = null) {
  findings.push({ code, route, source, message, target, blockingStatus: 'unreviewed' })
}

async function collectFrontmatter(contentDir) {
  const findings = []
  const files = (await walkFiles(contentDir)).filter((file) => file.endsWith('.mdx'))
  const documents = []
  const posts = []
  const fixedPages = []

  for (const filePath of files) {
    const relative = path.relative(contentDir, filePath).split(path.sep).join('/')
    const source = await readFile(filePath, 'utf8')
    const parsed = parseFrontmatter(source, relative)
    const isPost = relative.startsWith('posts/') && relative !== 'posts/index.mdx'
    const indexWithoutMetadata =
      relative === 'posts/index.mdx' && parsed.error === 'missing frontmatter block'
    const item = {
      source: relative,
      kind: isPost ? 'post' : 'fixed-or-index',
      frontmatter: parsed.data,
      error: indexWithoutMetadata ? null : parsed.error,
      frontmatterStatus: indexWithoutMetadata
        ? 'not-present-index-document'
        : parsed.data
          ? 'parsed'
          : 'invalid',
    }
    documents.push(item)
    if (isPost) posts.push(item)
    else fixedPages.push(item)
    if (parsed.error && !indexWithoutMetadata)
      addFinding(findings, 'frontmatter-parse-error', null, relative, parsed.error)
  }

  const auditedFields = ['title', 'slug', 'date', 'tags', 'description', 'enableComment']
  const fields = [
    ...new Set([...auditedFields, ...posts.flatMap((post) => Object.keys(post.frontmatter || {}))]),
  ].sort()
  const fieldCounts = Object.fromEntries(
    fields.map((field) => {
      const values = posts
        .map((post) => post.frontmatter?.[field])
        .filter((value) => value !== undefined)
      const valueTypes = {}
      for (const value of values)
        valueTypes[valueType(value)] = (valueTypes[valueType(value)] || 0) + 1
      return [field, { present: values.length, absent: posts.length - values.length, valueTypes }]
    })
  )
  const observedOnAllPosts = fields.filter((field) => fieldCounts[field].present === posts.length)
  const uniqueValues = new Map()
  const slugs = new Map()

  for (const post of posts) {
    const fm = post.frontmatter || {}
    const route = typeof fm.slug === 'string' ? normalizeSlug(fm.slug) : null
    for (const [field, expectedType] of [
      ['title', 'string'],
      ['date', 'string'],
      ['tags', 'array'],
      ['enableComment', 'boolean'],
    ]) {
      if (fm[field] !== undefined && valueType(fm[field]) !== expectedType) {
        addFinding(
          findings,
          'frontmatter-type',
          null,
          post.source,
          `${field} should be a ${expectedType}; observed ${valueType(fm[field])}`,
          field
        )
      }
    }
    if (fm.description !== undefined && typeof fm.description !== 'string') {
      addFinding(
        findings,
        'frontmatter-type',
        null,
        post.source,
        `description should be a string when present; observed ${valueType(fm.description)}`,
        'description'
      )
    }
    if (Array.isArray(fm.tags) && fm.tags.some((tag) => typeof tag !== 'string')) {
      addFinding(
        findings,
        'frontmatter-tag-type',
        null,
        post.source,
        'tags contains a non-string value',
        'tags'
      )
    }
    if (typeof fm.date === 'string' && !Number.isFinite(Date.parse(fm.date))) {
      addFinding(
        findings,
        'invalid-date',
        null,
        post.source,
        `date is not parseable: ${fm.date}`,
        'date'
      )
    }
    const filenameSlug = path.basename(post.source, '.mdx')
    if (typeof fm.slug === 'string' && normalizeSlug(fm.slug) !== normalizeSlug(filenameSlug)) {
      addFinding(
        findings,
        'slug-file-mismatch',
        null,
        post.source,
        `slug ${JSON.stringify(fm.slug)} differs from filename ${JSON.stringify(filenameSlug)}`,
        fm.slug
      )
    }
    if (route) {
      if (slugs.has(route)) {
        addFinding(
          findings,
          'duplicate-slug',
          null,
          post.source,
          `normalized slug also appears in ${slugs.get(route)}`,
          route
        )
      } else slugs.set(route, post.source)
    }
    for (const field of ['title', 'date']) {
      const value = fm[field]
      if (value === undefined || value === null || value === '') continue
      const key = `${field}:${String(value)}`
      if (uniqueValues.has(key)) {
        addFinding(
          findings,
          field === 'title' ? 'duplicate-title' : 'duplicate-date',
          null,
          post.source,
          `${field} is shared with ${uniqueValues.get(key)}`,
          value
        )
      } else uniqueValues.set(key, post.source)
    }
  }

  const sortedPosts = posts
    .filter((post) => post.frontmatter)
    .slice()
    .sort((left, right) => {
      const leftDate = Date.parse(left.frontmatter.date)
      const rightDate = Date.parse(right.frontmatter.date)
      return rightDate - leftDate
    })
    .map((post) => ({
      source: post.source,
      title: post.frontmatter.title ?? null,
      date: post.frontmatter.date ?? null,
      slug: post.frontmatter.slug ?? null,
      tags: post.frontmatter.tags ?? null,
      description: post.frontmatter.description ?? null,
      enableComment: post.frontmatter.enableComment ?? null,
    }))

  return {
    summary: {
      documentCount: documents.length,
      postCount: posts.length,
      fixedOrIndexCount: fixedPages.length,
    },
    fields,
    fieldCounts,
    observedOnAllPosts,
    posts: sortedPosts,
    fixedOrIndexPages: fixedPages.map(({ source, frontmatter, error, frontmatterStatus }) => ({
      source,
      frontmatter,
      error,
      frontmatterStatus,
    })),
    findings,
  }
}

async function collectPages(siteDir, origin) {
  const findings = []
  const htmlFiles = (await walkFiles(siteDir)).filter(
    (file) => htmlFileRoute(siteDir, file) !== null
  )
  const routes = htmlFiles.map((file) => {
    const route = htmlFileRoute(siteDir, file)
    const kind =
      route === '/404'
        ? 'error-fallback'
        : route === '/_not-found'
          ? 'framework-not-found'
          : 'public-page'
    return { route, file, kind }
  })
  const routeMap = new Map()
  for (const item of routes) {
    if (routeMap.has(item.route))
      addFinding(
        findings,
        'duplicate-route',
        item.route,
        item.file,
        `route also rendered by ${routeMap.get(item.route)}`,
        item.route
      )
    else routeMap.set(item.route, item.file)
  }

  const pages = []
  for (const { route, file } of routes) {
    const html = await readFile(file, 'utf8')
    const document = parse5.parse(html)
    const ids = []
    const headings = []
    const links = []
    const assets = []
    const inlineStyles = []
    const nodeLinks = new Map()
    const metadata = {
      title: null,
      description: null,
      canonical: null,
      openGraph: {},
      twitter: {},
      meta: [],
    }
    const idLocations = new Map()
    let mainText = ''
    let mainElement
    let pagefindElement
    let pagefindBodyCount = 0

    visitTree(document, (node) => {
      if (!node.tagName) return
      const attr = attrs(node)
      if (node.tagName === 'main' && !mainElement) mainElement = node
      if (node.tagName === 'title' && metadata.title === null)
        metadata.title = textContent(node).trim()
      if (node.tagName === 'style') inlineStyles.push(textContent(node))
      if (attr.style) inlineStyles.push(attr.style)
      if (node.tagName === 'meta') {
        const name = (attr.name || '').toLowerCase()
        const property = (attr.property || '').toLowerCase()
        const key = name || property || (attr.charset ? 'charset' : '')
        const content = attr.content ?? attr.charset ?? null
        if (key) metadata.meta.push({ key, content })
        if (name === 'description') metadata.description = content
        if (property.startsWith('og:')) metadata.openGraph[property.slice(3)] = content
        if (name.startsWith('twitter:')) metadata.twitter[name.slice(8)] = content
      }
      if (node.tagName === 'link') {
        const rels = (attr.rel || '').toLowerCase().split(/\s+/)
        if (rels.includes('canonical')) metadata.canonical = attr.href || null
      }
      if (attr['data-pagefind-body'] !== undefined) {
        pagefindBodyCount += 1
        if (!pagefindElement) pagefindElement = node
      }
      if (attr.id !== undefined) {
        ids.push(attr.id)
        if (idLocations.has(attr.id)) {
          addFinding(
            findings,
            'duplicate-id',
            route,
            file,
            `id ${JSON.stringify(attr.id)} appears more than once`,
            attr.id
          )
        } else idLocations.set(attr.id, node.tagName)
      }
      if (/^h[1-6]$/.test(node.tagName)) {
        headings.push({
          level: Number(node.tagName.slice(1)),
          id: attr.id ?? null,
          text: textContent(node).replace(/\s+/g, ' ').trim(),
        })
      }
      if (node.tagName === 'a' && attr.href !== undefined) {
        const url = safeResolveUrl(attr.href, route, origin)
        const internal = url?.origin === new URL(origin).origin
        const link = {
          href: attr.href,
          text: textContent(node).replace(/\s+/g, ' ').trim(),
          internal,
          targetRoute: internal ? normalizedRoute(decodePathname(url.pathname)) : null,
          fragment: url?.hash ? decodePathname(url.hash.slice(1)) : null,
        }
        links.push(link)
        nodeLinks.set(node, link)
      }
      const srcset = attr.srcset || attr.imagesrcset
      const assetValues = []
      for (const name of ASSET_ATTRS)
        if (attr[name] !== undefined) assetValues.push({ value: attr[name], attribute: name })
      if (srcset) {
        for (const candidate of srcset.split(',')) {
          const value = candidate.trim().split(/\s+/)[0]
          if (value) assetValues.push({ value, attribute: attr.srcset ? 'srcset' : 'imagesrcset' })
        }
      }
      if (
        node.tagName === 'link' &&
        (attr.rel || '')
          .toLowerCase()
          .split(/\s+/)
          .some((rel) => ASSET_LINK_RELS.has(rel)) &&
        attr.href
      ) {
        assetValues.push({ value: attr.href, attribute: 'href' })
      }
      if (node.tagName === 'script' && attr.src)
        assetValues.push({ value: attr.src, attribute: 'src' })
      for (const asset of assetValues) {
        const url = safeResolveUrl(asset.value, route, origin)
        assets.push({
          url: asset.value,
          tagName: node.tagName,
          attribute: asset.attribute,
          internal: url?.origin === new URL(origin).origin,
          exists: null,
          file: null,
        })
      }
    })
    const contentElement = mainElement || pagefindElement
    if (contentElement) mainText = textContent(contentElement).replace(/\s+/g, ' ').trim()
    const contentLinks = []
    if (contentElement)
      visitTree(contentElement, (node) => {
        const link = nodeLinks.get(node)
        if (link) contentLinks.push(link)
      })
    const contentPostRoutes = contentLinks
      .filter((link) => link.internal && link.targetRoute?.startsWith('/posts/'))
      .map((link) => link.targetRoute)
    let relatedPostRoutes = []
    let relatedHeading
    visitTree(document, (node) => {
      if (
        /^h[1-6]$/.test(node.tagName || '') &&
        ['관련 글', 'related posts'].includes(
          textContent(node).replace(/\s+/g, ' ').trim().toLowerCase()
        )
      )
        relatedHeading = node
    })
    if (relatedHeading?.parentNode)
      visitTree(relatedHeading.parentNode, (node) => {
        const link = nodeLinks.get(node)
        if (link?.internal && !link.fragment && link.targetRoute?.startsWith('/posts/'))
          relatedPostRoutes.push(link.targetRoute)
      })

    for (const link of links) {
      if (!link.internal) continue
      const url = safeResolveUrl(link.href, route, origin)
      if (!url) continue
      const target = await localTarget(siteDir, url.pathname, routeMap)
      link.exists = target.exists
      if (!target.exists)
        addFinding(
          findings,
          'missing-route',
          route,
          file,
          `internal href does not resolve to a rendered route or exported file: ${link.href}`,
          link.href
        )
    }

    for (const asset of assets) {
      if (!asset.internal) continue
      const url = safeResolveUrl(asset.url, route, origin)
      if (!url) continue
      asset.exists = await hasFile(siteDir, url.pathname)
      if (!asset.exists)
        addFinding(
          findings,
          'missing-asset',
          route,
          file,
          `local asset does not exist in export: ${asset.url}`,
          asset.url
        )
      else asset.file = decodePathname(url.pathname).replace(/^\/+/, '')
    }

    pages.push({
      route,
      routeKind:
        routes.find((item) => item.route === route && item.file === file)?.kind ?? 'public-page',
      file: path.relative(siteDir, file).split(path.sep).join('/'),
      metadata: { ...metadata, htmlLang: findHtmlLang(document) },
      ids,
      headings,
      internalLinks: links.filter((link) => link.internal),
      externalLinks: links.filter((link) => !link.internal),
      assets,
      inlineStyles,
      contentPostRoutes,
      relatedPostRoutes,
      mainText,
      pagefindBodyCount,
      counts: {
        links: links.length,
        internalLinks: links.filter((link) => link.internal).length,
        headings: headings.length,
        images: countElements(document, 'img'),
        codeBlocks: countElements(document, 'pre'),
        iframes: countElements(document, 'iframe'),
      },
    })
  }

  const pageByRoute = new Map(pages.map((page) => [page.route, page]))
  for (const page of pages) {
    for (const link of page.internalLinks) {
      const targetPage = link.targetRoute ? pageByRoute.get(link.targetRoute) : null
      if (!link.fragment || !targetPage) continue
      if (!targetPage.ids.includes(link.fragment)) {
        addFinding(
          findings,
          'missing-anchor',
          page.route,
          page.file,
          `fragment #${link.fragment} is absent from ${targetPage.route}`,
          link.href
        )
      }
    }
  }
  return {
    routes: routes.map(({ route, file, kind }) => ({
      route,
      kind,
      file: path.relative(siteDir, file).split(path.sep).join('/'),
    })),
    pages,
    findings,
  }
}

function cssUrlValues(source) {
  const references = []
  const urlPattern = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi
  for (const match of source.matchAll(urlPattern))
    references.push((match[1] ?? match[2] ?? match[3] ?? '').trim())
  const importPattern = /@import\s+(?:url\([^)]*\)\s*)?["']([^"']+)["']/gi
  for (const match of source.matchAll(importPattern)) references.push(match[1].trim())
  return references.filter(Boolean)
}

async function collectCssReferences(siteDir, pages, origin, findings) {
  const pending = new Map()
  for (const page of pages) {
    for (const asset of page.assets) {
      if (asset.internal && asset.file && /\.css$/i.test(asset.file)) {
        if (!pending.has(asset.file)) pending.set(asset.file, new Set())
        pending.get(asset.file).add(page.route)
      }
    }
  }

  const visited = new Set()
  const references = []
  while (pending.size) {
    const [source, routes] = pending.entries().next().value
    pending.delete(source)
    if (visited.has(source)) continue
    visited.add(source)
    const css = await readFile(path.join(siteDir, source), 'utf8')
    const stylesheetUrl = new URL(`/${source.split(path.sep).join('/')}`, origin)
    for (const raw of cssUrlValues(css)) {
      let url
      try {
        url = new URL(raw, stylesheetUrl)
      } catch {
        references.push({
          source,
          routes: [...routes],
          url: raw,
          internal: false,
          exists: null,
          file: null,
        })
        continue
      }
      const internal = url.origin === origin && !['data:', 'blob:'].includes(url.protocol)
      const exists = internal ? await hasFile(siteDir, url.pathname) : null
      const file = exists ? decodePathname(url.pathname).replace(/^\/+/, '') : null
      references.push({
        source,
        routes: [...routes],
        url: raw,
        resolvedUrl: url.href,
        internal,
        exists,
        file,
      })
      if (internal && !exists)
        addFinding(
          findings,
          'missing-asset',
          routes.values().next().value ?? null,
          source,
          `local CSS asset does not exist in export: ${raw}`,
          raw
        )
      if (internal && exists && /\.css$/i.test(url.pathname) && !visited.has(file)) {
        if (!pending.has(file)) pending.set(file, new Set())
        for (const route of routes) pending.get(file).add(route)
      }
    }
  }

  for (const page of pages) {
    for (const [index, style] of page.inlineStyles.entries()) {
      const source = `${page.file}#style-${index + 1}`
      const baseUrl = new URL(page.route, `${origin}/`)
      for (const raw of cssUrlValues(style)) {
        let url
        try {
          url = new URL(raw, baseUrl)
        } catch {
          references.push({
            source,
            routes: [page.route],
            url: raw,
            internal: false,
            exists: null,
            file: null,
          })
          continue
        }
        const internal = url.origin === origin && !['data:', 'blob:'].includes(url.protocol)
        const exists = internal ? await hasFile(siteDir, url.pathname) : null
        const file = exists ? decodePathname(url.pathname).replace(/^\/+/, '') : null
        references.push({
          source,
          routes: [page.route],
          url: raw,
          resolvedUrl: url.href,
          internal,
          exists,
          file,
        })
        if (internal && !exists)
          addFinding(
            findings,
            'missing-asset',
            page.route,
            source,
            `local inline CSS asset does not exist in export: ${raw}`,
            raw
          )
      }
    }
    delete page.inlineStyles
  }
  return references
}

function findHtmlLang(document) {
  let lang = null
  visitTree(document, (node) => {
    if (node.tagName === 'html') lang = attrs(node).lang || null
  })
  return lang
}

function countElements(document, name) {
  let count = 0
  visitTree(document, (node) => {
    if (node.tagName === name) count += 1
  })
  return count
}

export async function collectBaseline({ siteDir, contentDir, origin = 'https://rinae.dev' }) {
  const siteRoot = await realpath(siteDir)
  const contentRoot = await realpath(contentDir)
  const parsedOrigin = new URL(origin)
  const rendered = await collectPages(siteRoot, parsedOrigin.origin)
  const frontmatter = await collectFrontmatter(contentRoot)
  const findings = [...rendered.findings, ...frontmatter.findings]
  const renderedRoutes = new Set(rendered.routes.map((item) => item.route))
  for (const post of frontmatter.posts) {
    if (typeof post.slug !== 'string') continue
    const expectedRoute = normalizedRoute(`/posts/${post.slug}`)
    if (!renderedRoutes.has(expectedRoute)) {
      addFinding(
        findings,
        'slug-rendered-route-mismatch',
        expectedRoute,
        post.source,
        `frontmatter slug does not resolve to a rendered route: ${post.slug}`,
        expectedRoute
      )
    }
  }
  const cssReferences = await collectCssReferences(
    siteRoot,
    rendered.pages,
    parsedOrigin.origin,
    findings
  )
  return {
    generatedAt: new Date().toISOString(),
    origin: parsedOrigin.origin,
    siteDirectory: siteRoot,
    contentDirectory: contentRoot,
    summary: {
      renderedRouteCount: rendered.routes.length,
      publicRenderedRouteCount: rendered.routes.filter((route) => route.kind === 'public-page')
        .length,
      errorFallbackCount: rendered.routes.filter((route) => route.kind !== 'public-page').length,
      frontmatterPostCount: frontmatter.summary.postCount,
      renderedPagefindBodyMarkerCount: rendered.pages.reduce(
        (count, page) => count + page.pagefindBodyCount,
        0
      ),
      findingCounts: Object.fromEntries(
        [...new Set(findings.map((finding) => finding.code))]
          .sort()
          .map((code) => [code, findings.filter((finding) => finding.code === code).length])
      ),
    },
    routes: rendered.routes,
    pages: rendered.pages,
    cssReferences,
    frontmatter,
    findings,
  }
}

function parseArguments(argv) {
  const values = {}
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (!arg.startsWith('--')) throw new Error(`Unexpected argument: ${arg}`)
    const key = arg.slice(2)
    if (key === 'help') return { help: true }
    values[key] = argv[++index]
    if (!values[key]) throw new Error(`Missing value for --${key}`)
  }
  return values
}

async function main() {
  const args = parseArguments(process.argv.slice(2))
  if (args.help) {
    console.log(
      'Usage: node scripts/collect-site-baseline.mjs --site out --content content --output report.json [--origin https://rinae.dev]'
    )
    return
  }
  for (const required of ['site', 'content', 'output'])
    if (!args[required]) throw new Error(`Required option missing: --${required}`)
  const result = await collectBaseline({
    siteDir: args.site,
    contentDir: args.content,
    origin: args.origin,
  })
  const output = path.resolve(args.output)
  const { mkdir, writeFile } = await import('node:fs/promises')
  await mkdir(path.dirname(output), { recursive: true })
  await writeFile(output, `${JSON.stringify(result, null, 2)}\n`)
  console.log(JSON.stringify({ output: pathToFileURL(output).href, ...result.summary }, null, 2))
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null
if (
  invokedPath &&
  (await realpath(invokedPath)) === (await realpath(fileURLToPath(import.meta.url)))
) {
  main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
