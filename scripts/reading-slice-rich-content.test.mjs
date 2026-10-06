import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
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

const renderedHeadings = (html) =>
  [...html.matchAll(/<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/g)]
    .map(([, level, attributes, contents]) => ({
      level: Number(level),
      id: attributes.match(/\bid="([^"]*)"/)?.[1] ?? null,
      text: contents
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
    }))
    .filter((heading) => heading.id !== null)

const highlightedLineNumbers = (codeBlock, className = 'highlighted') =>
  codeBlock
    .split('\n')
    .filter((line) => line.includes('class="line'))
    .flatMap((line, index) => {
      const classes = line.match(/class="([^"]+)"/)?.[1].split(/\s+/) ?? []
      return classes.includes(className) ? [index + 1] : []
    })

const hasCodeCopyBehavior = async (
  html,
  readExternalScript = async (src) => {
    const assetPath = src.match(/^\/_astro\/([A-Za-z0-9._/-]+\.js)$/)?.[1]
    if (!assetPath || assetPath.split('/').some((segment) => segment === '.' || segment === '..'))
      return ''

    try {
      return await readFile(path.join(repositoryRoot, 'dist/_astro', assetPath), 'utf8')
    } catch {
      return ''
    }
  }
) => {
  const scriptContents = await Promise.all(
    [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].map(
      async ([, attributes, inline]) => {
        const src = attributes.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1]
        if (src) return await readExternalScript(src)

        const type = attributes.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1]
        return type?.toLowerCase() === 'module' ? inline : ''
      }
    )
  )

  return scriptContents.some((script) =>
    [
      'navigator.clipboard.writeText',
      'aria-live',
      '코드가 복사되었습니다.',
      '코드 복사 실패',
    ].every((contract) => script.includes(contract))
  )
}

test('code-copy static contract accepts inline modules and external bundles, but rejects absent or incomplete scripts', async () => {
  const completeBehavior =
    'navigator.clipboard.writeText(code.textContent); status.setAttribute("aria-live", "polite"); status.textContent = "코드가 복사되었습니다."; status.textContent = "코드 복사 실패"'
  const inlineModule = `<script type="module">${completeBehavior}</script>`
  const externalBundle = '<script type="module" src="/_astro/code-copy.js"></script>'

  assert.equal(await hasCodeCopyBehavior(inlineModule), true)
  assert.equal(await hasCodeCopyBehavior(externalBundle, async () => completeBehavior), true)
  assert.equal(await hasCodeCopyBehavior('<article></article>'), false)
  assert.equal(
    await hasCodeCopyBehavior(
      '<script type="module">navigator.clipboard.writeText(code.innerText); aria-live</script>'
    ),
    false
  )
  assert.equal(
    await hasCodeCopyBehavior(
      '<script type="module">aria-live; 코드가 복사되었습니다.; 코드 복사 실패</script>'
    ),
    false
  )
})

const metaLanguageHeadingsFromBaseline = [
  { level: 2, id: '어셈블리-명령어--변수명', text: '어셈블리 명령어 → 변수명' },
  {
    level: 2,
    id: '변수명--심화-타입advanced-types',
    text: '변수명 → 심화 타입(Advanced Types)',
  },
  {
    level: 2,
    id: '사용되지-않을-경우deprecation와-다른-메타정보들',
    text: '사용되지 않을 경우(Deprecation)와 다른 메타정보들',
  },
  { level: 2, id: '추가-예시', text: '추가 예시' },
  { level: 2, id: '결론', text: '결론' },
  { level: 2, id: '번역-후기', text: '번역 후기' },
]

const useEffectHeadingTextsFromBaseline = [
  '번역 서문',
  '목차',
  'TLDR (Too Long; Didn’t Read - 요약)',
  '모든 랜더링은 고유의 Prop과 State가 있다',
  '모든 랜더링은 고유의 이벤트 핸들러를 가진다',
  '모든 랜더링은 고유의 이펙트를 가진다',
  '모든 랜더링은 고유의… 모든 것을 가지고 있다',
  '흐름을 거슬러 올라가기',
  '그러면 클린업(cleanup)은 뭐지?',
  '라이프사이클이 아니라 동기화',
  '리액트에게 이펙트를 비교하는 법을 가르치기',
  '리액트에게 의존성으로 거짓말하지 마라',
  '의존성으로 거짓말을 하면 생기는 일',
  '의존성을 솔직하게 적는 두 가지 방법',
  '이펙트가 자급자족 하도록 만들기',
  '함수형 업데이트와 구글 닥스(Google Docs)',
  '액션을 업데이트로부터 분리하기',
  '왜 useReducer가 Hooks의 치트 모드인가',
  '함수를 이펙트 안으로 옮기기',
  '하지만 저는 이 함수를 이펙트 안에 넣을 수 없어요',
  '함수도 데이터 흐름의 일부인가?',
  '경쟁 상태에 대해',
  '진입 장벽을 더 높이기',
  '마치며',
]

const useEffectHeadingIdsFromBaseline = [
  '번역-서문',
  '목차',
  'tldr-too-long-didnt-read---요약',
  '모든-랜더링은-고유의-prop과-state가-있다',
  '모든-랜더링은-고유의-이벤트-핸들러를-가진다',
  '모든-랜더링은-고유의-이펙트를-가진다',
  '모든-랜더링은-고유의-모든-것을-가지고-있다',
  '흐름을-거슬러-올라가기',
  '그러면-클린업cleanup은-뭐지',
  '라이프사이클이-아니라-동기화',
  '리액트에게-이펙트를-비교하는-법을-가르치기',
  '리액트에게-의존성으로-거짓말하지-마라',
  '의존성으로-거짓말을-하면-생기는-일',
  '의존성을-솔직하게-적는-두-가지-방법',
  '이펙트가-자급자족-하도록-만들기',
  '함수형-업데이트와-구글-닥스google-docs',
  '액션을-업데이트로부터-분리하기',
  '왜-usereducer가-hooks의-치트-모드인가',
  '함수를-이펙트-안으로-옮기기',
  '하지만-저는-이-함수를-이펙트-안에-넣을-수-없어요',
  '함수도-데이터-흐름의-일부인가',
  '경쟁-상태에-대해',
  '진입-장벽을-더-높이기',
  '마치며',
]

test('existing HTML-embed MDX preserves its public URL, headings, original iframe, and local image', async () => {
  await buildAstroSite()

  const html = await readFile(
    path.join(repositoryRoot, 'dist/posts/understanding-taming-the-meta-language-kor.html'),
    'utf8'
  )

  assert.match(html, /<h1\b[^>]*>\[번역\] 메타언어 길들이기<\/h1>/)
  assert.deepEqual(renderedHeadings(html), metaLanguageHeadingsFromBaseline)
  assert.match(html, /<iframe\b[^>]*src="https:\/\/www\.youtube\.com\/embed\/_0T5OSSzxms"/)
  assert.match(html, /class="twitter-tweet"/)
  assert.match(html, /platform\.twitter\.com\/widgets\.js/)

  const image = html.match(/<img\b[^>]*src="([^"]+)"[^>]*alt="The Flow"/)
  assert.ok(image, 'the existing illustration must be emitted as an image')
  assert.equal(image[1], '/images/2017-04-04.png')
  const imageBytes = await readFile(path.join(repositoryRoot, 'dist', image[1].slice(1)))
  assert.deepEqual([...imageBytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10])
})

test('existing JSX/GIF MDX preserves its public URL, baseline headings, local images, and code highlights', async () => {
  await buildAstroSite()

  const html = await readFile(
    path.join(repositoryRoot, 'dist/posts/a-complete-guide-to-useeffect-ko.html'),
    'utf8'
  )
  const headingRecords = renderedHeadings(html)

  assert.match(html, /<h1\b[^>]*>\[번역\] useEffect 완벽 가이드<\/h1>/)
  assert.deepEqual(
    headingRecords.map(({ id }) => id),
    useEffectHeadingIdsFromBaseline
  )
  assert.deepEqual(
    headingRecords.map(({ text }) => text),
    useEffectHeadingTextsFromBaseline
  )

  const imageTags = [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag)
  assert.equal(imageTags.length, 12, 'all twelve original article images must be emitted')
  const images = imageTags.map((tag) => ({
    src: tag.match(/\bsrc="([^"]+)"/)?.[1],
    alt: tag.match(/\balt="([^"]*)"/)?.[1],
  }))
  assert.equal(images.filter(({ src }) => src?.endsWith('.gif')).length, 11)
  for (const { src } of images) {
    assert.ok(
      src?.startsWith('/images/a-complete-guide-to-useeffect/'),
      `unexpected local src: ${src}`
    )
    const bytes = await readFile(path.join(repositoryRoot, 'dist', src.slice(1)))
    if (src.endsWith('.gif')) assert.match(bytes.toString('ascii', 0, 6), /^GIF8[79]a$/)
  }

  const codeBlocks = [...html.matchAll(/<pre\b[^>]*data-language="jsx"[^>]*>[\s\S]*?<\/pre>/g)].map(
    ([block]) => block
  )
  assert.ok(codeBlocks.length >= 60, 'existing JSX code fences must be emitted as highlighted code')
  assert.deepEqual(
    highlightedLineNumbers(codeBlocks[0]),
    [6],
    'the source fence {6} metadata must highlight only its sixth line'
  )
  const commaMetadataBlock = codeBlocks.find((block) => block.includes('처음 랜더링 시'))
  assert.ok(commaMetadataBlock, 'the existing comma-separated metadata example must be rendered')
  assert.deepEqual(highlightedLineNumbers(commaMetadataBlock), [3, 11, 19])
  const rangeMetadataBlock = codeBlocks.find((block) => block.includes('handleAlertClick'))
  assert.ok(rangeMetadataBlock, 'the existing ranged metadata example must be rendered')
  assert.deepEqual(
    highlightedLineNumbers(rangeMetadataBlock),
    [4, 5, 6, 7, 8, 16],
    'the range metadata must retain its in-bounds lines as in the preserved baseline'
  )
  assert.match(codeBlocks[0], /--shiki-light:/, 'code colors must include the light palette')
  assert.match(codeBlocks[0], /--shiki-dark:/, 'code colors must include the dark palette')
})

test('article code controls ship an accessible Clipboard API status without a React runtime', async () => {
  await buildAstroSite()

  const html = await readFile(
    path.join(repositoryRoot, 'dist/posts/a-complete-guide-to-useeffect-ko.html'),
    'utf8'
  )
  assert.equal(
    await hasCodeCopyBehavior(html),
    true,
    'the article must ship a script containing copy success, accessible status, and Clipboard API failure behavior'
  )
  assert.doesNotMatch(html, /react-dom|react\/jsx-runtime|preact\/hooks/i)
})
