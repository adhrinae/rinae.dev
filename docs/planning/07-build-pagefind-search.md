---
id: '07'
title: '한국어 검색 절편'
status: in-progress
blocked_by:
  - '03'
approval_required: []
---

# 07: 한국어 검색 절편

## What to build

독자가 실제 Pagefind 인덱스에서 한국어 제목·본문으로 글을 찾고 키보드로 결과를 선택해 읽을 수 있게 한다.

## Acceptance criteria

- [x] Astro 정적 산출물에서 Pagefind 인덱스를 생성하고 서비스 환경에서 검색 자산을 로드한다.
- [x] 대표 한국어 제목 및 본문 검색어로 기대하는 글을 찾고 기존 공개 경로로 이동한다.
- [x] 키보드 열기/닫기·입력·결과 선택·이동과 포커스 복귀/가시성 및 접근 가능한 이름을 확인한다. Escape 후 input에 focus가 유지되고, Tab은 다음 footer theme button으로 이동한다.
- [x] 빈 입력·결과 없음·한국어 조합 입력·빠른 연속 검색·반복 열기/닫기에서 결과 상태와 오류를 확인한다.
- [x] 검색 후 글 이동·뒤로가기·새로고침과 모바일 조작이 작동한다.
- [x] 기준선과 비교해 검색 기능을 보존하고 Pagefind 검색 자산/검증 경로에서 브라우저 콘솔·네트워크 오류가 없는지 확인한다.
  - 예외: 기준선 `ReactConf` 결과 글의 기존 YouTube iframe/Twitter widget이 불러오는 `syndication.twitter.com`, `googleads.g.doubleclick.net`, `static.doubleclick.net` 요청은 local browser에서 `ERR_SSL_PROTOCOL_ERROR`로 실패했다. Pagefind 자산이나 검색 UI 오류는 아니며, 기존 콘텐츠/외부 서비스는 이 티켓에서 변경하지 않았다.

## 범위 제한 및 검증 방법

Pagefind를 유지하고 기존 순위의 완전한 일치를 요구하지 않는다. 실제 생성 인덱스와 브라우저 사용자 조작을 검증하며 검색 API 모킹만으로 완료하지 않는다. 의도하지 않은 React 런타임과 불필요한 hydration을 추가하지 않는다.

## 실행 계획 및 기록

사용자의 “다음 작업 착수” 요청으로 선행 조건 `03`이 완료되고 `approval_required: []`인 티켓 07을 시작한다. 이번 범위는 5개 글·8개 태그의 현재 Astro representative slice 검색만이다. 86개 baseline 전체 검색 parity를 주장하지 않고, 전체 콘텐츠 이관·원격 push·배포는 하지 않는다. 계획과 실행 증거는 이 티켓에 기록한다.

### 기준선 및 초기 조사

- 기존 Next/Nextra의 `Search`는 footer에 있는 inline combobox이며 실제 Pagefind API를 `/_pagefind/pagefind.js`에서 가져온다. 검색 결과의 기존 공개 URL/anchor로 이동하고, Cmd/Ctrl+K 및 `/`로 input에 초점을 주며 loading/error/no-results 상태를 제공한다. 구현 근거: `src/components/custom-footer.tsx`, `node_modules/nextra/dist/client/components/search.js`.
- 기준선 API 검색 자료(`reports/02-baseline/pagefind-search.json`)에는 제목/본문 사례가 있다: `블로그` → `/posts/recreating-blog-2025`, `ReactConf` → `/posts/understanding-taming-the-meta-language-kor`. 둘 다 현재 5개 Astro 글 표본에 포함된다. 이 API 결과는 baseline 자료일 뿐 현재 UI 동작의 검증 증거가 아니다.
- `pagefind@1.5.2`는 이미 설치되어 있다. Next의 `postbuild`는 `.next/server/app`에 인덱스를 만들지만 Astro static build는 아직 Pagefind 후처리를 하지 않는다. Astro output은 `astro-dist`, `trailingSlash: never`, `build.format: file`이며 각 페이지 layout은 `<article data-pagefind-body>`를 제공한다.
- 공식 Pagefind Component UI의 inline `<pagefind-searchbox>`는 검색·combobox 결과·키보드 방향키/Enter/Escape·Cmd/Ctrl+K를 제공하고 `html lang=ko`에 따라 로케일을 선택한다. 생성된 Component UI JS/CSS를 사용하면 custom search runtime/React hydration 없이 기존 footer 검색 형태에 가깝게 구현할 수 있다. 참고: [Component UI](https://pagefind.app/docs/search-ui/), [Searchbox](https://pagefind.app/docs/components/searchbox/), [JavaScript API](https://pagefind.app/docs/api/), [Indexing](https://pagefind.app/docs/indexing/), [CSS variables](https://pagefind.app/docs/css-variables/).

### 실행 순서

1. Astro build lifecycle에 Pagefind 1.5.2 후처리를 연결해 **실제 `astro-dist` HTML**을 인덱싱하고, 기존 Next `build`/`postbuild` 동작은 유지한다. Index/UI asset 위치와 반복 빌드 동작을 확인한다.
2. Footer의 현재 search slot에 built-in Pagefind searchbox를 연결한다. Generated Component UI CSS/module만 로드하고 bundle path를 Astro의 static search asset에 맞춘다. Light/dark theme styling과 한국어 accessible name/placeholder를 확인한다. 가능한 범위에서 기존 `/` 및 Cmd/Ctrl+K shortcut behavior를 보존하되 내부 custom element 구조에 결합하지 않는다. Test-only synthetic preview route가 검색 결과에 노출되지 않도록 output contract를 확인한다.
3. Public output 회귀 테스트를 추가한다: Pagefind assets/index가 생성되고 UI/search bundle URL과 component가 static HTML에 연결되며 disabled/non-search output이나 React runtime이 추가되지 않는지 검증한다. 실제 검색어/결과는 API mock으로 대체하지 않는다.
4. Playwright 실제 브라우저에서 local static server가 **생성된 Pagefind index**를 서비스하는 상태로 제목·본문 한국어 쿼리와 공개 결과 URL, 키보드 열기/닫기·입력·선택·focus/ARIA, 빈 입력/no results, Hangul composition, rapid searches, 반복 open/close, result navigation/back/reload, mobile interaction/overflow, console/network를 검증한다. 미실행/불가능 항목은 통과 처리하지 않는다.
5. `pnpm astro:test`, `pnpm astro:build` (Pagefind 포함), 기존 `pnpm build`를 실행하고 출력물을 직접 확인한다. 완료 기준 충족 후에만 로컬 task branch commit→`integration/astro-migration` merge를 하고 post-merge tests를 실행한다. 원격 push/deploy는 하지 않는다.

### 반복 검증 수정: footer 검색 결과 패널 위치

실제 desktop viewport(1280×720)에서 검색 결과 패널이 footer 입력 아래로 열려 화면 밖으로 잘리는 것을 발견했다. 이를 해결하려던 두 시도는 실패했다.

1. `top:auto; bottom:100%` override는 절대 위치 요소의 기본 static-position 계산과 함께 기대한 위쪽 배치가 되지 않았다.
2. `translateY(...)` override도 Pagefind Component UI의 고특이도 `transform: revert` reset에 덮였다.

수정 계획을 좁혀 CSS-only 배치 override를 Pagefind reset보다 우선시키고, 실제 브라우저에서 입력/패널 경계와 viewport bounds를 측정한다. Desktop·mobile에서 위쪽 배치 및 입력 가능한 결과 상태를 다시 확인한다. 검색 런타임/React를 추가하지 않는다.

### 구현 및 검증 기록

- `package.json`의 `astro:build`에 Pagefind 1.5.2 후처리를 추가하고, `astro:test`에 정적 출력 계약 테스트를 등록했다. 기존 Next `build`/`postbuild`는 그대로 유지했다.
- Footer에 built-in `<pagefind-searchbox>`를 추가하고 `SiteLayout`에서 UI CSS/module과 기본 `/pagefind/` 대신 `/_pagefind/` bundle 경로를 설정했다. 처음 브라우저 확인에서는 component가 기본 `/pagefind/pagefind.js`를 요청해 검색 자산을 로드하지 못했다. `<pagefind-config bundle-path="/_pagefind/">`를 추가한 뒤 실제 검색 자산이 모두 200으로 로드됐다.
- Astro `build.format: file` 출력에서 기본 Pagefind 결과 URL은 `.html`로 끝났다. 첫 결과 선택 브라우저 흐름에서 공개 URL이 `.html`로 바뀌는 것을 확인했고, `data-pagefind-meta="url:..."`에 정규화 경로를 넣어 `/posts/...`, `/tags/...` 및 `/`를 보존했다. 출력 테스트가 home, list, article, tag 경로를 확인한다.
- 합성 미리보기 route에 `pagefindIndex={false}`를 전달해 Pagefind body marker에서 제외했다. `fixture` 검색은 “결과 없음”으로 확인했고, Pagefind는 16개 HTML 중 실제 페이지 15개만 인덱싱했다.
- Footer가 화면 하단에 있어 기본 dropdown이 viewport 밖으로 열리는 문제를 실제 브라우저에서 발견했다. 위의 두 실패 후 최종 CSS-only override는 `transform: translateY(...) !important`로 Pagefind의 reset을 우선시한다. 1280×720 브라우저에서 input과 결과 패널 모두 viewport 안에 있고 panel은 위쪽으로 열리는 것을 측정했다. Light/dark 결과 대비도 실제 computed style로 확인했다. 증거: `/tmp/rinae-pagefind-07/search-results-final.png`, `/tmp/rinae-pagefind-07/search-results-dark.png`.
- Astro 정적 산출물에서 기본 favicon 요청이 404였으므로, 기존 `src/app/icon.svg`와 같은 `public/favicon.svg`를 제공하고 layout에서 참조했다. `cmp`로 두 파일이 동일함을 확인했다.
- `pnpm astro:test`: 27/27 통과. 진단 테스트가 일부러 실패시키는 빌드 로그는 기대된 결과다.
- `pnpm astro:build`: 16 HTML 산출물, Pagefind 1.5.2, 한국어 15페이지·5,829단어. Pagefind의 한국어 stemming 미지원 안내는 정상이며 완전한 어근 변형 검색 parity를 의미하지 않는다.
- `pnpm build`: Next 126/126 정적 페이지와 기존 postbuild Pagefind 121페이지·32,897단어 생성.
- `pnpm exec prettier --check`는 CSS, `package.json`, 출력 테스트, 티켓 문서에서 통과했다. 설치된 Prettier에는 Astro parser가 없어 `.astro` 파일은 자동 formatting check에서 제외했다. `git diff --check`도 통과했다.
- 실제 browser 검증(`/tmp/rinae-pagefind-07/`): `블로그` 제목 검색 → `/posts/recreating-blog-2025`; 기준선 본문 검색 `ReactConf` → `/posts/understanding-taming-the-meta-language-kor`; 추가 본문 검색 `useMemo` → `/posts/review-when-to-usememo-and-usecallback`. 페이지 이동, clean public URL, reload, back, Enter 이중 입력(목적지 document 요청 1회), 빠른 재검색, no-results/empty, 조합 이벤트 시뮬레이션 `메타언어 길들이기`, 합성 `fixture` 제외, Escape 반복, Meta+K, ArrowDown/Up, ARIA listbox/option, focus-visible, Tab 이동, theme, iPhone 15 393px tap 및 가로 overflow 부재를 확인했다. Composition은 Playwright 이벤트 시뮬레이션이지 실제 OS IME 입력은 아니다.
- `/_pagefind/pagefind-component-ui.css/js`, `pagefind.js`, worker, index/metadata/wasm/fragments 및 favicon 요청이 200이었고, 검색 UI/홈/검색 이동 검증에서 console errors·failed requests·HTTP 4xx/5xx는 없었다. 단, 위 기준선 글 자체의 외부 embed 요청 실패는 예외로 보존했다.
- 기존 Nextra `/` shortcut은 이행하지 않았다. 공식 inline searchbox가 제공하는 shortcut 속성 하나로 `mod+k`를 보존했다. `/`까지 지원하려면 내부 input을 찾는 별도 listener가 필요해 no-custom-runtime/low-coupling 방향과 맞지 않아 생략했다.
- 기존 사용자 `.gitignore` 변경은 보존하고 stage하지 않았다. 전체 86개 콘텐츠 검색 parity, 원격 push, deploy는 범위 밖이며 수행하지 않았다.

동일 단계 두 번 실패 시 원인과 수정 계획을 이 티켓에 기록하고 재시도 전 계획을 조정한다. Acceptance criteria별 결과와 범위 외 예외를 기록했으며, 최종 status는 로컬 통합과 post-merge 검증 후 `done`으로 갱신한다.
