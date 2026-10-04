import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const decodeHtml = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/gi, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const renderedHeadings = (html) =>
  [...html.matchAll(/<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/g)]
    .map(([, level, attributes, contents]) => {
      const id = attributes.match(/\bid="([^"]*)"/)?.[1] ?? null
      const text = decodeHtml(contents.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ')).trim()
      return { level: Number(level), id, text }
    })
    .filter((heading) => heading.id !== null)

const assertTocItemBlockMargins = (rule) => {
  let start
  let end
  for (const declaration of rule
    .slice(rule.indexOf('{') + 1)
    .replace(/}\s*$/, '')
    .split(';')) {
    const [property, value] = declaration.split(':').map((part) => part.trim())
    if (property === 'margin-block') {
      const values = value.split(/\s+/)
      assert.ok(values.length === 1 || values.length === 2, 'invalid margin-block shorthand')
      start = values[0]
      end = values[1] ?? values[0]
    } else if (property === 'margin-block-start') {
      start = value
    } else if (property === 'margin-block-end') {
      end = value
    }
  }
  assert.equal(start, '0', 'TOC item block-start margin must be zero')
  assert.equal(end, '.5rem', 'TOC item block-end margin must be .5rem')
}

test('TOC item block-margin helper accepts equivalent longhand and shorthand', () => {
  for (const declarations of [
    'margin-block-start:0;margin-block-end:.5rem',
    'margin-block-end: .5rem; margin-block-start: 0;',
    'margin-block:0 .5rem',
    ' margin-block : 0   .5rem ; ',
  ]) {
    assertTocItemBlockMargins(`.toc-list>:not(:last-child){${declarations}`)
  }
})

test('TOC item block-margin helper rejects incorrect or missing margins', () => {
  for (const declarations of [
    'margin-block:0 1rem',
    'margin-block:1rem .5rem',
    'margin-block:.5rem',
    'margin-block:0',
    'margin-block-start:0;margin-block-end:1rem',
    'margin-block-start:.5rem;margin-block-end:.5rem',
    'margin-block-end:.5rem',
    'margin-block-start:0',
    'color:red',
    '',
    'margin-block:0 .5rem;margin-block-end:1rem',
    'margin-block:0 .5rem;margin-block-start:1rem',
  ]) {
    assert.throws(
      () => assertTocItemBlockMargins(`.toc-list>:not(:last-child){${declarations}`),
      assert.AssertionError,
      declarations
    )
  }
})

// Compare declaration values, not minifier spelling or declaration order.
const cssDeclarations = (css, selector) => {
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  const declarations = new Map()
  for (const [, selectors, body] of rules) {
    if (!selectors.split(',').some((value) => value.trim() === selector)) continue
    for (const declaration of body.split(';')) {
      const colon = declaration.indexOf(':')
      if (colon !== -1)
        declarations.set(declaration.slice(0, colon).trim(), declaration.slice(colon + 1).trim())
    }
  }
  return declarations
}

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

const fineArtHeadingsFromBaseline = [
  { level: 2, id: '길고-두서없는-서문', text: '길고 두서없는 서문' },
  {
    level: 3,
    id: '세상은-천천히-움직이는-사람을-선호한다',
    text: '세상은 천천히 움직이는 사람을 선호한다',
  },
  {
    level: 3,
    id: '정확히-무엇을-얘기하려-하는가',
    text: '정확히 무엇을 얘기하려 하는가',
  },
  {
    level: 2,
    id: '1-당신이-시간을-어떻게-쓰는지-측정하라',
    text: '1. 당신이 시간을 어떻게 쓰는지 측정하라',
  },
  { level: 3, id: '짧은-버전', text: '짧은 버전' },
  { level: 3, id: '긴-버전', text: '긴 버전' },
  { level: 2, id: '2-멀티태스킹을-그만둬라', text: '2. 멀티태스킹을 그만둬라' },
  { level: 3, id: '짧은-버전-1', text: '짧은 버전' },
  { level: 3, id: '긴-버전-1', text: '긴 버전' },
  { level: 2, id: '3-업무를-연결하라', text: '3. 업무를 연결하라' },
  { level: 3, id: '짧은-버전-2', text: '짧은 버전' },
  { level: 3, id: '긴-버전-2', text: '긴 버전' },
  {
    level: 3,
    id: '잘못된-애자일-방법론을-적용하면-생산성에-좋지-않은-영향을-미친다',
    text: '잘못된 애자일 방법론을 적용하면 생산성에 좋지 않은 영향을 미친다',
  },
]

const syntheticMarkdownHeadings = [
  {
    level: 2,
    id: '또-새로-만들자-이번엔-혼자가-아니다',
    text: '또 새로 만들자. 이번엔 혼자가 아니다.',
  },
  { level: 3, id: '짧은-버전', text: '짧은 버전' },
  { level: 3, id: '짧은-버전-1', text: '짧은 버전' },
  {
    level: 2,
    id: 'nextra-and-usememo-링크',
    text: 'Nextra? and useMemo 링크',
  },
  {
    level: 3,
    id: '문장-부호-markdown',
    text: '문장 부호?! (Markdown)',
  },
]

const reviewHeadingsFromBaseline = [
  {
    level: 2,
    id: '더-많은-함수-호출-더-많은-코드는-결국-더-많은-비용을-초래한다',
    text: '더 많은 함수 호출, 더 많은 코드는 결국 더 많은 비용을 초래한다',
  },
  {
    level: 2,
    id: '그렇다면-usememo-는',
    text: '그렇다면 useMemo 는?',
  },
  { level: 2, id: '먼저-요점을-짚어보자', text: '먼저 요점을 짚어보자' },
  {
    level: 2,
    id: '그렇다면-usememo-와-usecallback-은-언제-써야할까',
    text: '그렇다면 useMemo 와 useCallback 은 언제 써야할까?',
  },
  { level: 2, id: '궁극적으로-말하고자-하는-것', text: '궁극적으로 말하고자 하는 것' },
]

const headingsFromBaseline = [
  { level: 2, id: '낡아가는-블로그', text: '낡아가는 블로그' },
  {
    level: 2,
    id: '또-새로-만들자-이번엔-혼자가-아니다',
    text: '또 새로 만들자. 이번엔 혼자가 아니다.',
  },
  { level: 2, id: '요구사항-정리하기', text: '요구사항 정리하기' },
  { level: 2, id: 'nextra', text: 'Nextra?' },
  {
    level: 2,
    id: 'ai와-함께하는-마이그레이션',
    text: 'AI와 함께하는 마이그레이션',
  },
  { level: 2, id: '이제-글만-쓰면-된다', text: '이제 글만 쓰면 된다' },
  {
    level: 2,
    id: '정적-사이트로-빌드할-때-알아두면-좋은-것',
    text: '정적 사이트로 빌드할 때 알아두면 좋은 것',
  },
]

test('existing MDX keeps its public URL and baseline heading IDs in static HTML', async () => {
  await buildAstroSite()

  const html = await readFile(
    path.join(repositoryRoot, 'astro-dist/posts/recreating-blog-2025.html'),
    'utf8'
  )

  assert.match(html, /<h1\b[^>]*>블로그 다시 만들기<\/h1>/)
  assert.deepEqual(renderedHeadings(html), headingsFromBaseline)
})

test('synthetic Markdown renders as a labeled preview with Korean and inline-markup heading IDs', async () => {
  await buildAstroSite()

  const html = await readFile(
    path.join(repositoryRoot, 'astro-dist/preview/markdown-heading-fixture.html'),
    'utf8'
  )

  assert.match(html, /합성 Markdown 미리보기/)
  assert.match(html, /기존 게시물이 아닙니다/)
  assert.deepEqual(renderedHeadings(html), syntheticMarkdownHeadings)
})

test('other representative MDX keeps baseline heading levels, text, punctuation, and duplicate IDs', async () => {
  await buildAstroSite()

  const fineArt = await readFile(
    path.join(repositoryRoot, 'astro-dist/posts/the-fine-art-of-fast-development-kr-1.html'),
    'utf8'
  )
  const review = await readFile(
    path.join(repositoryRoot, 'astro-dist/posts/review-when-to-usememo-and-usecallback.html'),
    'utf8'
  )

  assert.deepEqual(renderedHeadings(fineArt), fineArtHeadingsFromBaseline)
  assert.deepEqual(renderedHeadings(review), reviewHeadingsFromBaseline)
})

test('article and Markdown TOCs use final heading IDs, hierarchy, and native open details without hydration', async () => {
  await buildAstroSite()

  const article = await readFile(
    path.join(repositoryRoot, 'astro-dist/posts/the-fine-art-of-fast-development-kr-1.html'),
    'utf8'
  )
  const fixture = await readFile(
    path.join(repositoryRoot, 'astro-dist/preview/markdown-heading-fixture.html'),
    'utf8'
  )
  const tableOfContents = (html) => {
    const labelPosition = html.indexOf('aria-label="Table of contents"')
    assert.notEqual(labelPosition, -1, 'article is missing its Table of contents navigation')
    const navStart = html.lastIndexOf('<nav', labelPosition)
    const navEnd = html.indexOf('</nav>', labelPosition)
    assert.ok(navStart !== -1 && navEnd !== -1, 'Table of contents navigation is incomplete')
    return html.slice(html.indexOf('>', labelPosition) + 1, navEnd)
  }
  const tocLinks = (toc) => {
    const links = []
    let cursor = 0

    while ((cursor = toc.indexOf('<a ', cursor)) !== -1) {
      const tagEnd = toc.indexOf('>', cursor)
      const labelEnd = toc.indexOf('</a>', tagEnd)
      const tag = toc.slice(cursor, tagEnd + 1)
      const targetStart = tag.indexOf('href="#')
      assert.notEqual(targetStart, -1, 'TOC links must use fragment targets')
      const idStart = targetStart + 'href="#'.length
      const idEnd = tag.indexOf('"', idStart)
      links.push({
        id: tag.slice(idStart, idEnd),
        text: decodeHtml(toc.slice(tagEnd + 1, labelEnd)),
      })
      cursor = labelEnd + '</a>'.length
    }

    return links
  }
  const listDepthFor = (toc, id) => {
    const linkPosition = toc.indexOf(`href="#${id}"`)
    assert.notEqual(linkPosition, -1, `missing TOC target #${id}`)
    const prefix = toc.slice(0, linkPosition)
    let depth = 0
    let cursor = 0

    while (cursor < prefix.length) {
      const open = prefix.indexOf('<ul', cursor)
      const close = prefix.indexOf('</ul>', cursor)
      if (open === -1 && close === -1) break
      if (close === -1 || (open !== -1 && open < close)) {
        depth += 1
        cursor = open + '<ul'.length
      } else {
        depth -= 1
        cursor = close + '</ul>'.length
      }
    }

    return depth
  }
  const detailsStartTag = (toc) => {
    const start = toc.indexOf('<details')
    const end = toc.indexOf('>', start)
    assert.ok(start !== -1 && end !== -1, 'TOC must use native details')
    return toc.slice(start, end + 1)
  }
  const assertNoClientRuntime = (html) => {
    for (const marker of ['<script', '<astro-island', 'react-dom', 'react/jsx-runtime']) {
      assert.equal(html.includes(marker), false, `unexpected client runtime marker: ${marker}`)
    }
  }

  const articleToc = tableOfContents(article)
  const articleHeadings = renderedHeadings(article)
  const articleLinks = tocLinks(articleToc)
  assert.deepEqual(
    articleLinks,
    articleHeadings.map(({ id, text }) => ({ id, text }))
  )
  assert.equal(listDepthFor(articleToc, articleHeadings[0].id), 1)
  assert.equal(listDepthFor(articleToc, articleHeadings[1].id), 2)
  assert.equal(listDepthFor(articleToc, articleHeadings[3].id), 1)
  assert.ok(detailsStartTag(articleToc).includes(' open'), 'TOC details should be open by default')
  assert.ok(articleToc.includes('목차'), 'TOC summary should be visibly labeled')
  assertNoClientRuntime(article)

  const fixtureToc = tableOfContents(fixture)
  assert.deepEqual(
    tocLinks(fixtureToc),
    renderedHeadings(fixture).map(({ id, text }) => ({ id, text }))
  )
  assert.ok(
    detailsStartTag(fixtureToc).includes(' open'),
    'Markdown preview TOC should be open by default'
  )
  assertNoClientRuntime(fixture)
})

test('Noto Sans KR loads browser Google CSS with readable native fallbacks and no local font injection', async () => {
  await buildAstroSite()

  const html = await readFile(
    path.join(repositoryRoot, 'astro-dist/posts/the-fine-art-of-fast-development-kr-1.html'),
    'utf8'
  )
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map(([tag]) => tag)
  const stylesheet = links.find((tag) => tag.includes('fonts.googleapis.com/css2'))
  assert.ok(stylesheet, 'browser must request Google Fonts CSS')
  assert.match(stylesheet, /rel="stylesheet"/)
  const url = new URL(decodeHtml(stylesheet.match(/href="([^"]+)"/)[1]))
  assert.equal(url.origin, 'https://fonts.googleapis.com')
  assert.equal(url.pathname, '/css2')
  assert.equal(url.searchParams.get('family'), 'Noto Sans KR:wght@400;500;700')
  assert.equal(url.searchParams.get('display'), 'swap')
  assert.ok(
    links.some(
      (tag) =>
        tag.includes('rel="preconnect"') && tag.includes('href="https://fonts.googleapis.com"')
    )
  )
  assert.ok(
    links.some(
      (tag) =>
        tag.includes('rel="preconnect"') &&
        tag.includes('href="https://fonts.gstatic.com"') &&
        /crossorigin(?:="[^"]*")?/i.test(tag)
    )
  )
  const localStyles = await Promise.all(
    links
      .filter((tag) => tag.includes('rel="stylesheet"') && tag.includes('href="/_astro/'))
      .map((tag) =>
        readFile(path.join(repositoryRoot, 'astro-dist', tag.match(/href="\/([^"]+)"/)[1]), 'utf8')
      )
  )
  const renderedStyles = html + localStyles.join('\n')
  const bodyFamily = renderedStyles.match(/body\s*\{[^}]*font-family:([^;}]+)/)?.[1]
  assert.ok(bodyFamily, 'body must define a native fallback stack')
  assert.deepEqual(
    bodyFamily.split(',').map((name) => name.trim().replaceAll('"', '').replaceAll("'", '')),
    [
      'Noto Sans KR',
      '-apple-system',
      'BlinkMacSystemFont',
      'Apple SD Gothic Neo',
      'Segoe UI',
      'Malgun Gothic',
      '맑은 고딕',
      'sans-serif',
    ]
  )
  for (const marker of [
    '@font-face',
    '--font-noto-sans-kr',
    '/_astro/fonts/',
    '.woff2',
    '<script',
    '<astro-island',
    'react-dom',
    'react/jsx-runtime',
  ]) {
    assert.equal(
      renderedStyles.includes(marker),
      false,
      `unexpected injected font or client runtime: ${marker}`
    )
  }
})

test('baseline article markup and emitted CSS retain scoped reading contracts', async () => {
  await buildAstroSite()
  const html = await readFile(
    path.join(repositoryRoot, 'astro-dist/posts/the-fine-art-of-fast-development-kr-1.html'),
    'utf8'
  )
  const css = (
    await Promise.all(
      [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="\/([^"?]+)"[^>]*>/g)].map(
        ([, href]) => readFile(path.join(repositoryRoot, 'astro-dist', href), 'utf8')
      )
    )
  ).join('\n')
  assert.match(html, /<h1 class="reading-title"/)
  assert.match(
    html,
    /class="reading-metadata"[\s\S]*href="\/posts"[\s\S]*<time[\s\S]*aria-label="Table of contents"/
  )
  assert.match(html, /class="toc-nested"><ul class="toc-list"/)
  assert.match(html, /data-toc[^>]*open/)
  assert.match(html, /M3\.5 6\.5L8 11L12\.5 6\.5/)
  const rule = (selector) => css.slice(css.lastIndexOf(selector + '{')).split('}')[0]
  assert.match(rule('.reading-title'), /font-size:1\.875rem/)
  assert.match(rule('.reading-title'), /line-height:2\.25rem/)
  assert.match(rule('.reading-title'), /font-weight:600/)
  assert.match(css, /--reading-background:\s*#fff(?:[;}])/)
  assert.match(css, /--reading-background:\s*#0a0a0a/)
  assert.match(rule('.toc-nested'), /margin-top:\.5rem/)
  assert.match(rule('.toc-nested'), /margin-left:\.75rem/)
  assert.doesNotMatch(rule('.toc-nested'), /border/)
  assert.match(rule('.toc-list a'), /text-decoration:underline/)
  assert.doesNotMatch(css, /\.toc-list(?:,| ul\{)/)
  assert.match(css, /rotate\(180deg\)/)
  assert.match(rule('.toc'), /border-radius:\.625rem/)
  assert.match(rule('.toc'), /var\(--reading-card\) 80%/)
  assert.match(rule('.toc'), /var\(--reading-border\) 80%/)
  assert.match(rule('.toc'), /box-shadow:/)
  assertTocItemBlockMargins(rule('.toc-list>:not(:last-child)'))
  assert.match(css, /list-style-type:disc/)
  assert.match(rule('html'), /background:var\(--reading-background\)/)
  assert.match(rule('body'), /background:var\(--reading-background\)/)
})

test('reading rhythm restores original block flow and text utility leading without resetting prose margins', async () => {
  await buildAstroSite()
  const html = await readFile(
    path.join(repositoryRoot, 'astro-dist/posts/the-fine-art-of-fast-development-kr-1.html'),
    'utf8'
  )
  const css = (
    await Promise.all(
      [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="\/([^"?]+)"[^>]*>/g)].map(
        ([, href]) => readFile(path.join(repositoryRoot, 'astro-dist', href), 'utf8')
      )
    )
  ).join('\n')
  assert.equal(
    cssDeclarations(css, '.reading-post').get('display'),
    'block',
    'original unlayered article rule defeats flex; gap must be inert'
  )
  const rem = (selector, property, expected) => {
    const value = cssDeclarations(css, selector).get(property)
    assert.ok(value?.endsWith('rem'), `${selector} ${property} must retain rem units`)
    assert.equal(Number.parseFloat(value), expected, `${selector} ${property}`)
  }
  rem('.reading-metadata', 'line-height', 1.25)
  rem('.reading-metadata', 'margin-bottom', 1.5)
  rem('.reading-metadata .back-to-list svg', 'height', 1.5)
  rem('.reading-metadata .metadata-point', 'height', 1.5)
  rem('.toc', 'line-height', 1.25)
  rem('.toc summary', 'line-height', 1)
  rem('.toc-list a', 'line-height', 1.25)
  for (const selector of ['.reading-title', '.toc-list', '.toc-list a']) {
    assert.equal(
      cssDeclarations(css, selector).has('margin'),
      false,
      `${selector} must not reset inherited prose margins`
    )
  }
})

test('home and list expose the same selected posts in date order with original public URLs', async () => {
  await buildAstroSite()

  const home = await readFile(path.join(repositoryRoot, 'astro-dist/index.html'), 'utf8')
  const list = await readFile(path.join(repositoryRoot, 'astro-dist/posts.html'), 'utf8')
  const postSlugs = [...list.matchAll(/<a\b[^>]*href="\/posts\/([^"/#?]+)"[^>]*>/g)].map(
    ([, slug]) => slug
  )
  const detail = await readFile(
    path.join(repositoryRoot, 'astro-dist/posts/the-fine-art-of-fast-development-kr-1.html'),
    'utf8'
  )

  assert.match(home, /href="\/posts"/)
  assert.deepEqual(postSlugs, [
    'recreating-blog-2025',
    'review-when-to-usememo-and-usecallback',
    'the-fine-art-of-fast-development-kr-1',
  ])
  assert.match(list, /블로그 다시 만들기/)
  assert.match(list, /2019-06-09/)
  assert.match(detail, /<time[^>]*datetime="2019-05-12"/)
})
