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
    path.join(repositoryRoot, 'dist/posts/recreating-blog-2025.html'),
    'utf8'
  )

  assert.match(html, /<h1\b[^>]*>블로그 다시 만들기<\/h1>/)
  assert.deepEqual(renderedHeadings(html), headingsFromBaseline)
})

test('synthetic Markdown renders as a labeled preview with Korean and inline-markup heading IDs', async () => {
  await buildAstroSite()

  const html = await readFile(
    path.join(repositoryRoot, 'dist/preview/markdown-heading-fixture.html'),
    'utf8'
  )

  assert.match(html, /합성 Markdown 미리보기/)
  assert.match(html, /기존 게시물이 아닙니다/)
  assert.deepEqual(renderedHeadings(html), syntheticMarkdownHeadings)
})

test('other representative MDX keeps baseline heading levels, text, punctuation, and duplicate IDs', async () => {
  await buildAstroSite()

  const fineArt = await readFile(
    path.join(repositoryRoot, 'dist/posts/the-fine-art-of-fast-development-kr-1.html'),
    'utf8'
  )
  const review = await readFile(
    path.join(repositoryRoot, 'dist/posts/review-when-to-usememo-and-usecallback.html'),
    'utf8'
  )

  assert.deepEqual(renderedHeadings(fineArt), fineArtHeadingsFromBaseline)
  assert.deepEqual(renderedHeadings(review), reviewHeadingsFromBaseline)
})

test('the synthetic Markdown preview TOC uses final heading IDs and native open details without hydration', async () => {
  await buildAstroSite()

  const fixture = await readFile(
    path.join(repositoryRoot, 'dist/preview/markdown-heading-fixture.html'),
    'utf8'
  )
  const tableOfContents = (html) => {
    const labelPosition = html.indexOf('aria-label="Table of contents"')
    assert.notEqual(labelPosition, -1, 'page is missing its Table of contents navigation')
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
  const detailsStartTag = (toc) => {
    const start = toc.indexOf('<details')
    const end = toc.indexOf('>', start)
    assert.ok(start !== -1 && end !== -1, 'TOC must use native details')
    return toc.slice(start, end + 1)
  }
  const assertNoFrameworkRuntime = (html) => {
    for (const marker of ['<astro-island', 'react-dom', 'react/jsx-runtime', 'preact/hooks']) {
      assert.equal(html.includes(marker), false, `unexpected framework runtime marker: ${marker}`)
    }
  }

  const fixtureToc = tableOfContents(fixture)
  assert.deepEqual(
    tocLinks(fixtureToc),
    renderedHeadings(fixture).map(({ id, text }) => ({ id, text }))
  )
  assert.ok(
    detailsStartTag(fixtureToc).includes(' open'),
    'Markdown preview TOC should be open by default'
  )
  assertNoFrameworkRuntime(fixture)
})

test('Noto Sans KR loads browser Google CSS with readable native fallbacks and no local font injection', async () => {
  await buildAstroSite()

  const html = await readFile(
    path.join(repositoryRoot, 'dist/posts/the-fine-art-of-fast-development-kr-1.html'),
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
        readFile(path.join(repositoryRoot, 'dist', tag.match(/href="\/([^"]+)"/)[1]), 'utf8')
      )
  )
  const renderedStyles = html + localStyles.join('\n')
  const bodyFamily = renderedStyles.match(/\.font-sans\s*\{[^}]*font-family:([^;}]+)/)?.[1]
  assert.ok(bodyFamily, 'the body font utility must define a native fallback stack')
  assert.match(html, /<body class="[^"]*\bfont-sans\b/)
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
    path.join(repositoryRoot, 'dist/posts/the-fine-art-of-fast-development-kr-1.html'),
    'utf8'
  )
  const css = (
    await Promise.all(
      [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="\/([^"?]+)"[^>]*>/g)].map(
        ([, href]) => readFile(path.join(repositoryRoot, 'dist', href), 'utf8')
      )
    )
  ).join('\n')
  assert.match(html, /<h1 class="reading-title\b/)
  assert.match(
    html,
    /class="reading-metadata[^"]*"[\s\S]*href="\/posts"[\s\S]*<time[\s\S]*aria-label="Table of contents"/
  )
  assert.match(html, /class="toc-nested[^"]*"><ul class="toc-list"/)
  assert.match(html, /data-toc[^>]*open/)
  assert.match(html, /M3\.5 6\.5L8 11L12\.5 6\.5/)
  // Ticket 18 moved component styling into Tailwind utilities. Assert the markup carries the
  // utility contract and the compiled stylesheet emits the matching utilities.
  assert.match(
    html,
    /class="reading-title[^"]*\btext-3xl\b[^"]*\bleading-9\b[^"]*\bfont-semibold\b/
  )
  assert.match(
    html,
    /class="toc [^"]*\brounded-\[0\.625rem\][^"]*\bborder-border\/80\b[^"]*\bbg-card\/80\b[^"]*\bshadow-sm\b/
  )
  assert.match(html, /class="toc-nested[^"]*\bmt-2\b[^"]*\bml-3\b/)
  assert.doesNotMatch(html, /class="toc-nested[^"]*\bborder\b/)
  assert.match(html, /<a class="[^"]*\bunderline\b[^"]*" href="#/)
  assert.match(html, /class="toc-list"><li class="mb-2 last:mb-0"/)
  assert.match(css, /--reading-background:\s*#fff(?:[;}])/)
  assert.match(css, /--reading-background:\s*#0a0a0a/)
  assert.doesNotMatch(css, /\.toc-list(?:,| ul\{)/)
  assert.match(css, /rotate:180deg/)
  assert.match(css, /list-style-type:disc/)
  assert.match(html, /<html lang="ko" dir="ltr" class="bg-background[^"]*"/)
  assert.match(html, /<body class="[^"]*\bbg-background\b[^"]*"/)
  const rule = (selector) =>
    `${selector}{${[...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
      .filter(([, selectors]) => selectors.split(',').some((value) => value.trim() === selector))
      .map(([, , body]) => body)
      .join(';')}}`
  assert.match(rule('.bg-background'), /var\(--reading-background\)/)
  assert.match(rule('.font-semibold'), /font-weight/)
  assert.match(rule('.text-3xl'), /font-size/)
})

test('reading rhythm restores original block flow and text utility leading without resetting prose margins', async () => {
  await buildAstroSite()
  const html = await readFile(
    path.join(repositoryRoot, 'dist/posts/the-fine-art-of-fast-development-kr-1.html'),
    'utf8'
  )
  // Ticket 18: block flow and leading now come from utilities on the markup.
  assert.match(html, /class="reading-post[^"]*\bblock\b[^"]*"/)
  assert.match(html, /class="reading-metadata[^"]*\bmb-6\b[^"]*\bleading-5\b/)
  assert.match(html, /class="back-to-list[^"]*"[\s\S]*?<svg class="[^"]*\bh-6\b[^"]*"/)
  assert.match(html, /class="metadata-point[^"]*\bh-6\b[^"]*\bw-3\b/)
  assert.match(html, /class="toc [^"]*\bleading-5\b/)
  assert.match(html, /class="[^"]*\bleading-4\b[^"]*"[^>]*><span>목차/)
  assert.match(html, /<a class="[^"]*\bleading-5\b[^"]*" href="#/)
  const classOf = (regex) => html.match(regex)?.[1] ?? ''
  for (const [selector, value] of [
    ['.reading-title', classOf(/<h1 class="(reading-title[^"]*)"/)],
    ['.toc-list', classOf(/<ul class="(toc-list[^"]*)"/)],
    ['.toc-list a', classOf(/<a class="([^"]*)" href="#/)],
  ]) {
    assert.doesNotMatch(
      value,
      /\bm[trblxy]?-\S+/,
      `${selector} must not reset inherited prose margins`
    )
  }
})

test('home lists the five newest public posts and the list keeps every baseline URL in date order', async () => {
  await buildAstroSite()

  const home = await readFile(path.join(repositoryRoot, 'dist/index.html'), 'utf8')
  const list = await readFile(path.join(repositoryRoot, 'dist/posts.html'), 'utf8')
  const slugs = (html) =>
    [...html.matchAll(/<a\b[^>]*href="\/posts\/([^"/#?]+)"[^>]*>/g)].map(([, slug]) => slug)
  const postSlugs = slugs(list)
  const detail = await readFile(
    path.join(repositoryRoot, 'dist/posts/the-fine-art-of-fast-development-kr-1.html'),
    'utf8'
  )

  assert.equal(postSlugs.length, 86, 'the list must expose every existing public post')
  assert.equal(new Set(postSlugs).size, 86, 'the list must not repeat a post')
  assert.deepEqual(slugs(home), postSlugs.slice(0, 5), 'home shows the five newest posts')
  assert.match(home, /href="\/posts"/)
  assert.match(list, /블로그 다시 만들기/)
  assert.match(list, /2019-06-09/)
  assert.match(detail, /<time[^>]*datetime="2019-05-12"/)
})
